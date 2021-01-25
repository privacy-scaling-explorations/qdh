import binpacking from 'binpacking'
import potpack from 'potpack'
import binPack from 'bin-pack'
import { MaxRectsPacker } from '@vanchelo/maxrects-packer'

export interface BinPackResult {
  canvas: any
  boxes: Array<any>
}

export default function pack(boxes: Array<any>, algo = 'potpack'): BinPackResult {
  switch (algo) {
    case 'potpack':
      return { canvas: potpack(boxes), boxes }
    case 'binPack':
      break
    case 'binpacking':
      break
    case 'maxrects':
      const _width = 640
      const packer = new MaxRectsPacker(_width, 1024, 4, {
        smart: true,
        pot: false,
        square: false,
        allowRotation: false,
        tag: false,
        border: 5,
      })
      packer.addArray(
        boxes.map(b => ({
          width: b.w,
          height: b.h,
          ...b,
        }))
      )
      packer.next()
      boxes = packer.bins[0].rects
      return {
        canvas: { w: _width },
        boxes: packer.bins[0].rects,
      }
    default:
      return { canvas: potpack(boxes), boxes }
  }
  return { canvas: {}, boxes: [] }
}
