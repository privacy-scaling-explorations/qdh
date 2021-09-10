![QDH Logo](https://quadratic.page/ballot-box-emoji.png)

# 쿼드라틱 달러 홈페이지

쿼드라틱 달러 홈페이지는 [밀리언달러 홈페이지](http://www.milliondollarhomepage.com/)와 유사합니다. 이 홈페이지 역시 웹페이지에 이미지를 게시할 수 있는 공간을 할당하는데, 사용자들이 각 이미지들이 얼마나 공간을 차지할지 투표할 수 있습니다. 또한 Quadratic voting과 MACI(Minimal Anti-Collusion Infrastructure)메커니즘을 이용해 부정거래를 방지하고 이미지를 2차적인 투표에 따라 결정합니다.

**데모영상**: [https://www.youtube.com/watch?v=b6VonnS8e1M](https://www.youtube.com/watch?v=b6VonnS8e1M)

## 로컬 호스트에서 QDH를 실행하는 방법

QDH 레포지토리를 클론하고 `yarn` 이나 `npm install`을 통해 dependency를 설치합니다:

```bash
git clone https://github.com/ksaitor/qdh
cd qdh
yarn  # or `npm install`
```

`.env.sample`를 복사하고 `.env`로 설정합니다.

`.env`에서 `MONGO_URL`이나 `AZURE_STORAGE_ACCOUNT_NAME`, `AZURE_CONTAINER_NAME`, `AZURE_KEY`, `AZURE_CONNECTION_STRING`과 같은 변수들의 값을 설정합니다. 이 문서의 마지막 부분에 MongoDB 와 Azure Storage 세팅에 대한 자세한 가이드를 볼 수 있습니다.

```bash
cp .env.sample .env
vim .env  # set `MONGO_URL, AZURE_STORAGE_ACCOUNT_NAME, etc...`
```

`.env` 파일을 올바르게 설정하면 다음과 같은 형태가 됩니다:

```bash
NEXT_PUBLIC_MACI_ADDRESS=0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4
NEXT_PUBLIC_POAP_ADDRESS=0x22C1f6050E56d2876009903609a2cC3fEf83B415

NEXT_PUBLIC_STRAPI_URL=https://strapi-admin.quadratic.page

MONGO_URL=mongodb+srv://user:password@mongodb-ip-or-dns.com/database...

AZURE_STORAGE_ACCOUNT_NAME=qdh
AZURE_CONTAINER_NAME=qdh-user-images
AZURE_KEY=24f234f234f+24f243f+24f243f/24f234f234f2f24f==...
AZURE_CONNECTION_STRING=DefaultEndpointsProtocol=https...
```

이제 `yarn dev` (또는 `npm run dev`)를 실행합니다.

> 만약 이미 `yarn dev` (또는 `npm run dev`)가 실행되고 있다면 기존의 프로세스를 종료하고 다시 시작해야합니다. Next.js는 `.env`를 자동으로 변환하지 않기 때문에 수동으로 다시 실행시켜야합니다.

다음과 같은 실행결과가 나옵니다:

```bash
Loaded env from /your-project-path/qdh/.env
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

이제 http://localhost:3000 에서 프론트엔드에 접근할 수 있습니다.

다음으로 로컬테스트넷에 MACI를 설정합니다.

## MACI 설정

다른 터미널에서 MACI를 클론합니다. MACI: [https://github.com/appliedzkp/maci](https://github.com/appliedzkp/maci)

다음 문서를 참고하여 설치합니다. ["Local development and testing"](https://github.com/appliedzkp/maci#local-development-and-testing): bootstrap MACI repo, install Rust, build zk-SNARKs, compile contracts...

커멘드 요약:

```bash
git clone git@github.com:appliedzkp/maci.git
cd maci
npm i && npm run bootstrap && npm run build

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh  # to install Rust
cargo install zkutil --version 0.3.2 && zkutil --help

cd circuits
npm run buildBatchUpdateStateTreeSnark && npm run buildQuadVoteTallySnark

cd ../contracts
npm run compileSol
```

같은 디렉토리(`maci/contracts`)에 Ganache 실행:

```bash
npm run ganache
```

다른 터미널에서 `maci/cli` 디렉토리에 새로운 MACI 투표를 생성:

```bash
node ./build/index.js create -d 0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3 \
	-sk macisk.8715ab59a3e88a7ceec80f214ec24a95287ef2cb399a329b6964a87f85cf51c \
	-e http://localhost:8545 \
	-s 15 \
	-o 60 \
	-bm 4 \
	-bv 4
```

MACI를 실행하고 투표를 만들면 다음과 같은 결과가 나옵니다:

```bash
MACI: 0x2C2B9C9a4a25e24B174f26114e8926a9f2128FE4
```

실행 후 15초 이내로 프론트엔드([http://localhost:3000](http://localhost:3000/))로 가서 로그인 하면 투표 및 MACI를 실행할 수 있습니다. 시간 내에 로그인 하지 못했다면 전 단계의 ganache와 MACI를 다시 실행하십시오. 또한, `s 15`를 `s 30`로 바꾸면 로그인 허용시간을 바꿀 수 있습니다.

반드시 메타마스크를 로컬테스트넷`locahost:8545`에 연결하고 테스트 지갑을 가져와야합니다.

자세한 방법과 MACI 커멘드는 [MACI Demonstration](https://github.com/appliedzkp/maci/tree/master/cli#demonstration)문서에서 확인할 수 있습니다.

Koh Wei Jie의 MACI 영상: [Making Sense of MACI](https://www.youtube.com/watch?v=ooxgPzdaZ_s), [ZKPodcast: MACI with Koh Wei Jie](https://www.youtube.com/watch?v=f9nUGPD5I3o), [Minimum Anti-Collusion Infrastructure (MACI)](https://www.youtube.com/watch?v=sKuNj_IQVYI)

## 관리자 대시보드 설정

관리자 대시보드는 업로드된 이미지를 관리하고, QDH 프론트엔드에 기본 컨피그를 제공합니다. 또한, 투표결과가 집계되면 `tally.json`을 업로드합니다.

[관리자 대시보드](https://github.com/ksaitor/qdh-admin)를 실행하는 것은 필수는 아니지만 권장합니다. 이것은 [Strapi](https://strapi.io/)라고 하는 headless CMS 오픈소스를 기반으로 하고 있습니다. 해당 레포의 README문서에서 자세한 사항을 확인할 수 있습니다.

[https://github.com/ksaitor/qdh-admin](https://github.com/ksaitor/qdh-admin) 레포를 클론하고 `yarn` (또는 `npm install`)으로 dependency를 설치합니다.

```bash
git clone https://github.com/ksaitor/qdh-admin
cd qdh-admin
yarn  # or `npm install`
```

`.env.example`를 복사하고 `.env`로 설정합니다.

`.env`에서 `MONGO_URL`, `AZURE_STORAGE_ACCOUNT_NAME`, `AZURE_CONTAINER_NAME`, `AZURE_KEY`, `AZURE_CONNECTION_STRING`와 같은 변수들을 위에서 설정한 값과 동일하게 변수들을 설정합니다.

```bash
cp .env.example .env
vim .env # set `MONGO_URL`, `AZURE_STORAGE_ACCOUNT_NAME`, `AZURE_CONTAINER_NAME`, `AZURE_KEY`, `AZURE_CONNECTION_STRING`.
```

로컬서버를 실행하기 위해 `yarn develop`를 실행합니다.

이 API는 `http://localhost:1337`와 관리자 패널 `http://localhost:1337/admin`에서 사용가능합니다.

`NEXT_PUBLIC_STRAPI_URL=http://localhost:1337`을 *qdh frontend*의 `.env`에 업데이트하면, 로컬 프론트엔드가 로컬에서 실행되는 Strapi Admin API와 통신합니다.

## QDH 프로덕션으로 실행

이 레포는 

이 레포는 [Vercel](https://vercel.io/), [Heroku](https://heroku.com/), [Dokku](https://github.com/dokku/dokku)로 배포가 가능합니다. `.env` 의 환경변수를 배포하려는 플랫폼으로 추출해야합니다.

### Vercel로 배포

[Vercel CLI](https://vercel.com/download) 설치:

```bash
yarn global add vercel
# or
npm i -g vercel
```

그리고 `qdh/` 디렉토리에서 배포 프로세싱을 위해 `vercel` 을 실행합니다.(자동으로 실행됨)

```bash
vercel
```

또한 깃 레포를 임포트하여 배포할 수 있습니다. [https://vercel.com/new](https://vercel.com/new)

### Heroku로 배포

아직 `heroku` cli를 설치하지 않았다면 설치하십시오([https://devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)): 맥OS에서는 `brew tap heroku/brew && brew install heroku` 를 사용하고 우분투 16+에서는 `sudo snap install --classic heroku` 를 사용하십시오. 그리고 `heroku login` 을 실행하여 Heroku CLI를 계정에 연결하십시오.

그리고 `qdh/` 디렉토리에서 다음 커맨드를 수행하십시오:

```bash
heroku create qdh-frontend
heroku config:set $(cat .env | sed '/^$/d; /#[[:print:]]*$/d') --app qdh-frontend # this will pick up variables from .env and transport them to your heroku instance
heroku git:remote --app qdh-frontend
git push heroku master
```

만약 `qdh-frontend` 라는 이름이 이미 사용되었다면, 위의 커맨드를 다른 이름으로 수행하십시오.

### Dokku로 배포

[Dokku](https://github.com/dokku/dokku)는 mini-Heroku를 이용하는 도커입니다.

[해당문서](https://github.com/dokku/dokku#installation)를 참고해 Dokku를 서버에 설치하십시오. 퍼블릭 ssh키는 ~/.ssh/authorized_keys 뿐만 아니라 dokku에도 추가해야합니다. 그러면  로컬머신에서 다음 커맨드를 수행할 수 있습니다.

```bash
ssh -t dokku@your-server-ip apps:create qdh-frontend
ssh -t dokku@your-server-ip config:set qdh-frontend $(cat .env | sed '/^$/d; /#[[:print:]]*$/d') # this will pick up variables from .env and transport them to your dokku instance
git remote add dokku dokku@your-server-ip:qdh-frontend
git push dokku master
```

## Azure 저장소 설정

1. 저장소 계정을 생성하고 저장소명을 지정합니다. ex)qdh
2. Storage account > Overview 로 들어갑니다.
3. Containers에서 새 storage container를 생성합니다. 이름을 `qdh-user-images` 로 지정하고 "Public access level"이 **Blob (anonymous access for blobs only)**으로 설정되어있는지 확인합니다.
4. Settings > Access keys 에서 계정 이름과 키, 커넥션 스트링을 붙여넣습니다.
5. 이렇게하면 `AZURE_STORAGE_ACCOUNT_NAME`, `AZURE_CONTAINER_NAME`, `AZURE_KEY`, `AZURE_CONNECTION_STRING` 를 설정할 수 있습니다.

```bash
AZURE_STORAGE_ACCOUNT_NAME='qdh'
AZURE_CONTAINER_NAME='qdh-user-images'
AZURE_KEY='24f234f234f+24f243f+24f243f/24f234f234f2f24f==...'
AZURE_CONNECTION_STRING='DefaultEndpointsProtocol=https...'
```

![https://user-images.githubusercontent.com/936436/106730581-82522780-6649-11eb-88a7-a928e6bbe5bd.png](https://user-images.githubusercontent.com/936436/106730581-82522780-6649-11eb-88a7-a928e6bbe5bd.png)

p.s. 저희는 이 프로젝트를 클라우드 형태로 만들것입니다. 많은 기여 부탁드립니다!

## MongoDB 설정

- 쉬운 무료 MongoDB를 사용하려면 [Mongo Atlas](https://www.mongodb.com/cloud/atlas)를 사용하십시오
- [Dokku](https://github.com/dokku/dokku)를 사용했다면 [dokku-mongo](https://github.com/dokku/dokku-mongo) 플러그인을 사용하십시오
- 선택적으로 Iaas나 Paas로 MongoDB를 배포할 수 있습니다.