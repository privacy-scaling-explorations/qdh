# 최소한의 담합방지 인프라(maci) - 명령어

## 하위명령어

| 역할 | 행동 | 하위명령어 |
|-|-|-|
| User | MACI 키쌍 생성 | `genMaciKeypair` |
| User | MACI 공개키 생성 | `genMaciPubkey` |
| Coordinator | 투표 생성 | `create `|
| User | 가입하기 | `signup` |
| User | 키 변경 및 투표 | `publish` |
| Coordinator | 메시지 처리 및 투표 집계 증명 생성 | `genProofs` |
| Coordinator | 증명 제출 | `proveOnChain` |
| Coordinator | 증명을 제시하지않고 모든 투표를 처리후 집계 | `processAndTallyWithoutProofs` |
| Coordinator | MACI계약에서 메시지 처리 롤백 및 투표 집계 | `coordinatorReset` |

## 공개 키, 개인 키 형식

MACI는 메시지 해독 또는 명령어 서명과 같이 zk-SNARK내에서 발생하는 작업에 BabyJub필드의 개인키를 사용합니다.
MACI가 Ethereum에 배포되었기때문에, BabyJub 개인 키와 Ethereum 개인 키의 혼동을 피하고자 합니다.
이를위해, 사용자는 직렬화된 형식의 공개 키, 개인 키를 이 cli에 전달해야 합니다. 이를위해 우리는 `maci-domainobj`'s `PrivKey.serialize` 및
`PubKey.serialize` 함수를 사용합니다. 

직렬화된 공개 키, 개인 키의 예제:

```
Private key: macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c
Public key:  macipk.2c93053fcc4dc13dfb1cdd679aea39d1667af3d937e1430766e514fd24043999
```

### Coordinator: 투표 만들기

이 명령은 MACI계약의 인스턴스를 배포합니다.

모든 예제 명령은 기본적으로 local 이더리움 테스트넷 `http://localhost:8545`입니다. 테스트 목적으로, 다음을 실행할 수 있습니다:

```bash

# maci/contracts에서
npm run ganache
```

Coordinator가 설정해야 하는 필드:

`node build/index.js create <options>`

사용 예시:

```
$ node build/index.js create -sk macisk.23d007423d56475d7e39dcd5053c5aa98f57a69ee85bc7813ccbf4c5e688307  -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 -u 15 -m 15 -s 30 -o 30
```

출력 예시:

```
MACI: 0xE28158eCFde143e2536761c3254C7C31efd97271
```

| Option | Flags | About |
|-|-|-|
| Ethereum 공급자 | `-e` 또는 `--eth-provider` | Ethereum 공급자에 대한 연결 문자열. 기본: `http://localhost:8545` |
| Coordinator의 MACI 개인 키 | `-sk` 또는 `--privkey` | 직렬화된 MACI 개인 키입니다. 이것은 이더리움 개인 키가 아닙니다. 빅-엔디안값은 snark 필드 크기보다 작아야만 한다. |
| Coordinator의 MACI 개인 키에 대한 프롬프트 | `-dsk` 또는 `--prompt-for-maci-privkey` | If specified, ignores `-sk / --privkey` and prompts the coordinator to input their MACI private key |
| 배포자의 Ethereum 개인 키 | `-d` 또는 `--deployer-privkey` | MACI 계약을 배포하는데 사용할 Ethereum 계정의 개인 키 |
| 배포자의 Ethereum 개인 키에 대한 프롬프트 | `-dp` 또는 `--prompt-for-deployer-privkey` | 지정된 경우, `-d / --deployer-privkey`를 무시하고 coordinator에게 Ethereum 개인 키를 넣도록 프롬프트 |
| 최대 사용자 수 | `-u` 또는 `--max-users` | 기본값: 15 |
| 최대 메시지 수 | `-m` 또는 `--max-messages` | 기본값: 15 |
| 최대 투표 옵션 수 | `-v` 또는 `--max-vote-options` | 기본값: 25 |
| 가입 기간 | `-s` 또는 `--signup-duration` | 가입 기간이며, 단위는 초. |
| 투표 기간 | `-o` 또는 `--voting-duration` | 투표 기간이며, 단위는 초. |
| 초기 voice  | `-c` 또는 `--initial-voice-credits` | Default: 100 |
| 초기 voice credit 프록시 계약 | `-i` 또는 `--initial-vc-proxy` | 지정된 경우, 이 주소를 초기 voice credit 프록시 생성자 인수로 사용하여 MACI 계약을 배포합니다. 그렇지 않으면 위에서 지정한 값으로 ConstantInitialVoiceCreditProxy계약을 배포합니다. |
| 가입 gatekeeper 계약 | `-g` 또는 `--signup-gatekeeper` | 지정된 경우, 이 주소를 가입 gatekeeper 생성자 인수로 사용하여 MACI 계약을 배포합니다. 그렇지 않으면, 어떠한 주소든 등록될 수 있도록 하는 gatekeeper 계약을 배포합니다. | 
| 메시지 처리를 위한 Batch size | `-bm` 또는 `--message-batch-size` | 기본값: 4 |
| 투표 집계를 위한 Batch size | `-bv` 또는 `--tally-batch-size` | 기본값: 4 |

### Coordinator: 처리, 집계 및 결과 확인

`node build/index.js genProofs <options>`

Coordinator가 설정해야 하는 필드:

| Option | Flags | About |
|-|-|-|
| Ethereum 공급자 | `-e` 또는 `--eth-provider` | Ethereum 공급자에 대한 연결 문자열. 기본: `http://localhost:8545` |
| MACI 계약 주소 | `-x` 또는 `--contract` | 배포된 MACI 계약 주소 |
| Coordinator의 MACI 개인 키 | `-sk` 또는 `--privkey` | 위에 참조 |
| Coordinator의 Ethereum 개인 키 | `-d` 또는 `--eth-privkey` | 트랜잭션을 수행하는 데 사용할 이더리움 계정의 개인 키 |
| Coordinator의 Ethereum 개인 키를 위한 프롬프트 | `-dp` 또는 `--prompt-for-eth-privkey` | 지정된 경우, `-d / --eth-privkey`를 무시하고 coordinator의 Ethereum 개인키 입력을 위한 프롬프트 |
| 최종 집계 파일 | `-t` 또는 `--tally-file` | 최종 투표 집계와 salt를 저장할 파일 경로입니다. |

이 명령은 각 batch에 대한 증명 생성을 일시중지하고 다시 시작하는 것을 아직 지원하지 않습니다.

`node build/index.js proveOnChain <options>`

| Option | Flags | About |
|-|-|-|
| Ethereum 공급자 | `-e` 또는 `--eth-provider` | Ethereum 공급자에 대한 연결 문자열. 기본: `http://localhost:8545` |
| MACI 계약 주소 | `-x` 또는 `--contract` | 배포된 MACI 계약 주소 |
| Coordinator의 MACI 개인 키 | `-sk` 또는 `--privkey` | 위에 참조 |
| Coordinator의 Ethereum 개인 키 | `-d` 또는 `--eth-privkey` | 트랜잭션을 수행하는 데 사용할 이더리움 계정의 개인 키 |
| Coordinator의 Ethereum 개인 키를 위한 프롬프트 | `-dp` 또는 `--prompt-for-eth-privkey` | 지정된 경우, `-d / --eth-privkey`를 무시하고 coordinator의 Ethereum 개인키 입력을 위한 프롬프트 |

### User: MACI 키 쌍 생성

`node build/index.js genMaciKeypair <options>`

이 명령의 출력은 직렬화된 개인 키와 직렬화된 공개 키입니다.

### User: MACI 공개 키 생성

`node build/index.js genMaciPubkey <options>`

| Option | Flags | About |
|-|-|-|
| 개인 키 | `-sk` 또는 `--privKey` | 직렬화된 개인 키 |

이 명령의 출력은 주어진 개인 키에서 파생된 직렬화된 공개 키입니다.

### User: 가입

`node build/index.js signup <options>`

사용자가 설정해야 하는 필드:

| Option | Flags | About |
|-|-|-|
| Ethereum 공급자 | `-e` 또는 `--eth-provider` | Ethereum 공급자에 대한 연결 문자열. 기본: `http://localhost:8545` |
| MACI 계약 주소 | `-x` 또는 `--contract` | 배포된 MACI 계약 주소 |
| User의 MACI 공개 키 | `-p` 또는 `--pubkey` | 이것은 이더리움 공개 키가 아니어야 합니다. 대신 사용자의 직렬화된 BabyJub 공개 키여야 합니다(여기서 x 및 y 값은 연결되어 있습니다.) |
| User의 Ethereum 개인 키 | `-d` 또는 `--eth-privkey` | A private key of the Ethereum account to use to sign up |
| User의 Ethereum 개인 키를 위한 프롬프트 | `-dp` 또는 `--prompt-for-eth-privkey` | 지정된 경우, `-d / --eth-privkey`를 무시하고 user의 Ethereum 개인키 입력을 위한 프롬프트 |
| gatekeeper 프록시 데이터 가입 | `-s` 또는 `--sg-data` | 가입 게이트키퍼 프록시 계약에 전달할 16진수 문자열로, 사용자가 가입하도록 허용할지 여부를 결정하는 데 사용할 수 있습니다. 기본 값: an empty bytestring. |
| 초기 voice credit 프록시 데이터 | `-v` 또는 `--ivcp-data` | 사용자에게 할당할 voice credit 수를 결정하는 데 사용할 수 있는 초기 voice credit 프록시 계약에 전달할 16진수 문자열입니다. 기본 값: an empty bytestring. |

### User: 키 변경/투표

`node build/index.js publish <options>`

User가 설정해야 하는 필드:

| Option | Flags | About |
|-|-|-|
| Ethereum 공급자 | `-e` 또는 `--eth-provider` | Ethereum 공급자에 대한 연결 문자열. 기본: `http://localhost:8545` |
| MACI 계약 주소 | `-x` 또는 `--contract` | 배포된 MACI 계약 주소 |
| User의 MACI 개인 키 | `-sk` 또는 `--pubkey` | 이더리움 개인 키가 아니어야 합니다. |
| User의 MACI 개인 키를 위한 프롬프트 | `-dsk` 또는 `--prompt-for-maci-privkey` | 지정된 경우, `-sk / --privkey`를 무시하고 user의 MACI 개인 키 입력을 위한 프롬프트 |
| User의 Ethereum 개인 키 | `-d` 또는 `--eth-privkey` | 트랜잭션을 수행하는 데 사용할 이더리움 계정의 개인 키 |
| User의 Ethereum 개인 키를 위한 프롬프트 | `-dp` 또는 `--prompt-for-eth-privkey` | 지정된 경우, `-d / --eth-privkey`를 무시하고 user의 Ethereum 개인키 입력을 위한 프롬프트 |
| State index | `-i` 또는 `--state-index` | 사용자의 상태 index |
| User의 새로운 또는 현재 MACI 공개 키 | `-p` 또는 `--pubkey` | 명령이 유효한 경우 상태 트리에서 user의 공개 키를 대체해야 하는 직렬화된 BabyJub 공개 키여야 합니다.|
| 투표 옵션 index | `-v` 또는 `--vote-option-index` | 투표 옵션 index |
| 새 투표 가중치 | `-w` 또는 `--new-vote-weight` | 해당 투표 옵션에 할당할 투표 가중치 |
| Nonce | `-n` or `--nonce` | 메시지의 논스 값 |
| Salt | `-s` or `--salt` | 메시지의 salt. 지정하지 않으면 이 명령은 무작위로 salt를 생성합니다. |

### Anyone: 투표 집계 확인

`node build/index.js verify <options>`

설정할 필드:

| Option | Flags | About |
|-|-|-|
| 최종 집계 파일 | `-t` 또는 `--tally-file` | `tally`하위 명령에 의해 생성된 최종 집계 파일입니다. |

## 데모

이 섹션에는 라이브 데모에 유용한 명령 시퀀스가 포함되어 있습니다. 다음 시나리오를 시뮬레이션합니다:

1. Eve는 Alice에게 B당에 투표하도록 뇌물을 시도합니다.
2. Alice는 B당(`m0`)에 투표합니다.
3. Alice는 그녀의 키를 바꿉니다(`m1`)
4. Alice가 A당(`m2`)에 대해 투표를 제출합니다.
5. coordinator는 투표를 처리하고 최종 집계를 계산합니다.
6. 예상 결과는 A당이 1표, B당이 0표입니다. Alice의 무효표는 집계되지 않았고, Eve는 말할 방법이 없습니다.

메시지는 역순으로 처리되기 때문에 `m1`에 의해 메시지 `m0`가 유효하지 않게 랜더링 됩니다.

**Coordinator: 키 쌍 생성**

```
node ./build/index.js genMaciKeypair
```

출력 예시:

```
Private key: macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c
Public key:  macipk.2c93053fcc4dc13dfb1cdd679aea39d1667af3d937e1430766e514fd24043999

Please store your private key in a safe place and do not reveal it to anyone.
```

**Alice: 키 쌍 생성**

```
node ./build/index.js genMaciKeypair
```

출력 :

```
Private key: macisk.8d9bce75e0053db023ffd26597a4f389b33edd9236998e357cef36d5c978cc8
gublic key:  macipk.08b869d7dcc59913301478bec3e7020c9ca37d44aae886fa7be118fca34daf06

Please store your private key in a safe place and do not reveal it to anyone.
```

**Coordinator: 선거 생성**

```
node ./build/index.js create -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
	-sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
	-e http://localhost:8545 \
	-s 15 \
	-o 60 \
	-bm 4 \
	-bv 4
```

출력 예시:

```
MACI: 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4
```

**Alice: 가입**

```
node ./build/index.js signup -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
	-e http://localhost:8545 \
	-p macipk.08b869d7dcc59913301478bec3e7020c9ca37d44aae886fa7be118fca34daf06 \
	-x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4
```

출력 예시:

```
Transaction hash: 0x3cd2e6e805b54a6dfaff840dcf496092447400a1b26ba9f3c31bd78c3fe15723
State index: 1
```

**Alice: B당에 투표**

```
node ./build/index.js publish -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
	-e http://localhost:8545 \
	-x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
	-sk macisk.8d9bce75e0053db023ffd26597a4f389b33edd9236998e357cef36d5c978cc8 \
	-p macipk.08b869d7dcc59913301478bec3e7020c9ca37d44aae886fa7be118fca34daf06 \
	-i 1 \
	-v 1 \
	-w 9 \
	-n 1
```

출력 예시:

```
Transaction hash: 0xc52ff70c3bbcc91457fd61738cd00d09d8bac96c56094910e275e474132ff741
Ephemeral private key: macisk.1e3233eec8d0ccf722f2576ba5cb1b361939f0617ac3583a3eb025e4944b0e40
```

**Alice: 새 키 생성**

```
node ./build/index.js genMaciKeypair
```

출력 예시:

```
Private key: macisk.1c454dfd8d8afabc0955112ef32a665a0c8b85985ad65481bb9612c1ed188d0d
Public key:  macipk.be34a027c1be52d37646df2d39bcbe824877525838dcbdc4f242666fa9de7a8b

Please store your private key in a safe place and do not reveal it to anyone.
```

**Alice: 키 변경**

```sh
node ./build/index.js publish -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
	-e http://localhost:8545 \
	-x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
	-sk macisk.8d9bce75e0053db023ffd26597a4f389b33edd9236998e357cef36d5c978cc8 \
	-p macipk.be34a027c1be52d37646df2d39bcbe824877525838dcbdc4f242666fa9de7a8b \
	-i 1 \
	-v 0 \
	-w 9 \
	-n 1
```

출력 예시:

```
Transaction hash: 0x812dc6345e2515bced4f15e7ca3842d3d343c22f6729fe3216b946fa97bffc1e
Ephemeral private key: macisk.24115d8d585b7dd8f7ea1975668b3d4f34dcf8b1bcc6617bdefbed7e41b89846
```

**Alice: A당에 투표**

```
node ./build/index.js publish -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
	-e http://localhost:8545 \
	-x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.1c454dfd8d8afabc0955112ef32a665a0c8b85985ad65481bb9612c1ed188d0d \
	-p macipk.be34a027c1be52d37646df2d39bcbe824877525838dcbdc4f242666fa9de7a8b \
	-i 1 \
	-v 1 \
	-w 9 \
	-n 2
```

출력 예시:

```
Transaction hash: 0x45ae379b056a6fc647a3718bd356268a1bcda35e6645bb7a1aba44cb76418c98
Ephemeral private key: macisk.2b23e978301d029e46117ef0138f860e277ffed0f008712f3d7ca2c40f1a6768
```

**Coordinator: 증명을 생성하지 않고 모든 메시지와 투표를 처리하고 집계합니다.** 

Coordinator가 신속하게 결과를 요구하는 상황에서, 
`processAndTallyWithoutProofs`를 통해 모든 메시지를 처리하고 증거를 생성하지 않고 모든 투표를 집계하기 위해 실행할 수 있습니다.

```
node ./build/index.js processAndTallyWithoutProofs \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
	-e http://localhost:8545 \
	-x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
	-sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
	-t preProofTally.json
```

**Coordinator: 증거 생성** 

```
node build/index.js genProofs \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
    -o proofs.json \
    -t tally.json
```

출력 예시:

```
Generating proofs of message processing...

Progress: 1 / 2; batch index: 4
Loading circuit from /home/di/t/maci/circuits/params/batchUstCircuit.r1cs...
Proving...
Saved /home/di/t/maci/circuits/params/1615726027749.proof.json and /home/di/t/maci/circuits/params/1615726027749.publicSignals.json
Proof is correct

Progress: 2 / 2; batch index: 0
Loading circuit from /home/di/t/maci/circuits/params/batchUstCircuit.r1cs...
Proving...
Saved /home/di/t/maci/circuits/params/1615726036074.proof.json and /home/di/t/maci/circuits/params/1615726036074.publicSignals.json                                                                                                         
Proof is correct
Generating proofs of vote tallying...

Progress: 1 / 2; batch index: 0
Loading circuit from /home/di/t/maci/circuits/params/qvtCircuit.r1cs...
Proving...
Saved /home/di/t/maci/circuits/params/1615726042953.proof.json and /home/di/t/maci/circuits/params/1615726042953.publicSignals.json
Proof is correct

Progress: 2 / 2; batch index: 4
Loading circuit from /home/di/t/maci/circuits/params/qvtCircuit.r1cs...
Proving...
Saved /home/di/t/maci/circuits/params/1615726045769.proof.json and /home/di/t/maci/circuits/params/1615726045769.publicSignals.json
Proof is correct
```

**Coordinator: 모든 증거 제출**

```
node build/index.js proveOnChain \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
    -o proofs.json \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3
```

출력 예시:

```
Submitting proofs of message processing...

Progress: 1/true
Transaction hash: 0x7b0aa10dae7fc244d649a83dfeb1f126faa9b7ff5497c34b2aa2b539f39e1b99

Progress: 2/true
Transaction hash: 0x1741cc6294d502d987bffdf6ea5339e2bfbdee2caa53b9d4165b706301845b68
Submitting proofs of vote tallying...

Progress: 1/2
Transaction hash: 0xd059e72330db7f0402928b6e1a00ba7786d96ff66544b50d336aabc8dac4c719

Progress: 2/2
Transaction hash: 0x0e8405e8c80390508dbd9ed20eef0249574147ab708b06f8d22a9995c70d6869
```

이제 파일 `tally.json`에 다음과 같은 내용이 포함됩니다:

```json
{
    "provider": "http://localhost:8545",
    "maci": "0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4",
    "results": {
        "commitment": "0x1cd0ec2789abceb908b06f6a74c26a848e209011ec41b3e5028bb7aeff2bdeb2",
        "tally": [
            "9",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0"
        ],
        "salt": "0x2d7f1744185507a529fdb32dec920bfdaf825b0fdba5b66661a40a71beac3b46"
    },
    "totalVoiceCredits": {
        "spent": "81",
        "commitment": "0x2d55a42ec1da99227125cf9562aa91aad12e2f1387ccf3411da79b0a953d69a6",
        "salt": "0xfc95a102f3c66d92d7a5700f1e12a6f2325c54a10efa0e1178cc21b67f0d97c"
    },
    "totalVoiceCreditsPerVoteOption": {
        "commitment": "0x18526f481cf2476543c8dcc3762f3a54af8e217d3d048810856623367ef4ba14",
        "tally": [
            "81",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0",
            "0"
        ],
        "salt": "0x1f17d2ff16b9791ef4b1849bfccf420b9fece161e419ad4f8b1ef726c62e3943"
    }
}
```

이제 누구든지 `verify`를 실행하여 집계가 올바른지 확인할 수 있습니다:

```bash
node build/index.js verify -t tally.json
```

출력 예시:

```
The results commitment in the specified file is correct given the tally and salt
The total spent voice credit commitment in the specified file is correct given the tally and salt
The per vote option spent voice credit commitment in the specified file is correct given the tally and salt
The results commitment in the MACI contract on-chain is valid
The total spent voice credit commitment in the MACI contract on-chain is valid
The per vote option spent voice credit commitment in the MACI contract on-chain is valid
The total sum of votes in the MACI contract on-chain is valid.
```

## `prod-small` 설정 데모

MACI 인스턴스 생성:

```bash
node ./build/index.js create -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
	-sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
	-e http://localhost:8545 \
	-s 10 \
	-o 10 \
	-bm 4 \
	-bv 4 \
	-u 255 \
	-m 2048 && \
node ./build/index.js signup -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
	-e http://localhost:8545 \
	-p macipk.ec084c00a3de1f1f7d74e8af70852a778f477f3db0459b2b3709cbe6a8b20a93 \
	-x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 && \
node ./build/index.js publish -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
	-e http://localhost:8545 \
	-x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
	-sk macisk.adc328e5009b0267537dccc35998a04348eed1b93dd6d866c0f0401490b2f33 \
	-p macipk.ec084c00a3de1f1f7d74e8af70852a778f477f3db0459b2b3709cbe6a8b20a93 \
	-i 1 \
	-v 0 \
	-w 9 \
	-n 1 && \
node build/index.js genProofs \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
    -o proofs.json \
    -t tally.json && \
sleep 5 && \
node build/index.js proveOnChain \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
    -o proofs.json \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 && \
node ./build/index.js verify -t tally.json
```

## `prod-medium` 설정 데모

```bash
node ./build/index.js create \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
    -e http://localhost:8545 -s 10 -o 10 -bm 4 -bv 4 -u 511 -m 8192 && \
node ./build/index.js signup \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -p macipk.ec084c00a3de1f1f7d74e8af70852a778f477f3db0459b2b3709cbe6a8b20a93 \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 && \
node ./build/index.js publish \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.adc328e5009b0267537dccc35998a04348eed1b93dd6d866c0f0401490b2f33 \
    -p macipk.ec084c00a3de1f1f7d74e8af70852a778f477f3db0459b2b3709cbe6a8b20a93 \
    -i 1 -v 0 -w 9 -n 1 && \
sleep 5 && \
node build/index.js genProofs \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
    -o proofs.json \
    -t tally.json &&
node build/index.js proveOnChain \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
    -o proofs.json \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 && \
node ./build/index.js verify -t tally.json
```

## `prod-large` 설정 

```bash
node ./build/index.js create \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
    -e http://localhost:8545 -s 10 -o 10 -bm 8 -bv 4 -u 4095 -m 32768 && \
node ./build/index.js signup \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 && \
node ./build/index.js publish \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.adc328e5009b0267537dccc35998a04348eed1b93dd6d866c0f0401490b2f33 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -i 1 -v 0 -w 9 -n 1 && \
node ./build/index.js publish \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.adc328e5009b0267537dccc35998a04348eed1b93dd6d866c0f0401490b2f33 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -i 1 -v 0 -w 9 -n 1 && \
node build/index.js genProofs \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
    -o proofs.json \
    -t tally.json &&
sleep 5 && \
node build/index.js proveOnChain \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
    -o proofs.json \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 && \
node ./build/index.js verify -t tally.json
```


## `prod-32` 설정 데모

```bash
node ./build/index.js create \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
    -e http://localhost:8545 -s 120 -o 120 -bm 8 -bv 8 -u 4294967296 -m 4294967296 && \
node ./build/index.js signup \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 && \
node ./build/index.js signup \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 && \
node ./build/index.js signup \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 && \
node ./build/index.js signup \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 && \
node ./build/index.js signup \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 && \
node ./build/index.js signup \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 && \
node ./build/index.js signup \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 && \
node ./build/index.js publish \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.adc328e5009b0267537dccc35998a04348eed1b93dd6d866c0f0401490b2f33 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -i 1 -v 0 -w 9 -n 1 && \
node ./build/index.js publish \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.adc328e5009b0267537dccc35998a04348eed1b93dd6d866c0f0401490b2f33 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -i 1 -v 0 -w 9 -n 1 && \
node ./build/index.js publish \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.adc328e5009b0267537dccc35998a04348eed1b93dd6d866c0f0401490b2f33 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -i 1 -v 0 -w 9 -n 1 && \
node ./build/index.js publish \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.adc328e5009b0267537dccc35998a04348eed1b93dd6d866c0f0401490b2f33 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -i 1 -v 0 -w 9 -n 1 && \
node ./build/index.js publish \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.adc328e5009b0267537dccc35998a04348eed1b93dd6d866c0f0401490b2f33 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -i 1 -v 0 -w 9 -n 1 && \
node ./build/index.js publish \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.adc328e5009b0267537dccc35998a04348eed1b93dd6d866c0f0401490b2f33 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -i 1 -v 0 -w 9 -n 1 && \
node ./build/index.js publish \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.adc328e5009b0267537dccc35998a04348eed1b93dd6d866c0f0401490b2f33 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -i 1 -v 0 -w 9 -n 1 && \
node ./build/index.js publish \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
    -e http://localhost:8545 \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.adc328e5009b0267537dccc35998a04348eed1b93dd6d866c0f0401490b2f33 \
    -p macipk.a8edcf537cd83ab10157e567ff9313c10dd4561734cb56befe941b4ec546280a \
    -i 1 -v 0 -w 9 -n 1 && \
time node build/index.js genProofs \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
    -o proofs.json \
    -t tally.json &&
node build/index.js proveOnChain \
    -x 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4 \
    -sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
    -o proofs.json \
    -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 && \
node ./build/index.js verify -t tally.json
```
