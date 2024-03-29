/**
 * virtual list core calculating center
 */

const DIRECTION_TYPE = {
  FRONT: 'FRONT', // scroll up or left
  BEHIND: 'BEHIND' // scroll down or right
}
const CALC_TYPE = {
  INIT: 'INIT',
  FIXED: 'FIXED',
  DYNAMIC: 'DYNAMIC'
}
const LEADING_BUFFER = 2

export default class Virtual {
  constructor (param, updateCB) {
    this.init(param, updateCB)
  }

  init (param, updateCB) {
    // param data
    this.param = param
    this.cb = updateCB

    // size data
    this.sizes = new Map()
    this.firstRangeTotalSize = 0
    this.firstRangeAverageSize = 0
    this.lastCalcIndex = 0
    this.fixedSizeValue = 0
    this.calcType = CALC_TYPE.INIT

    // scroll data
    this.offset = 0
    this.direction = ''

    // range data
    this.range = Object.create(null)
    if (param) {
      this.checkRange(0, param.keeps - 1)
    }
  }

  destroy () {
    this.init(null, null)
  }

  getVirtualInfo () {
    const range = Object.create(null)
    range.start = this.range.start
    range.end = this.range.end
    range.padFront = this.range.padFront
    range.padBehind = this.range.padBehind
    return range
  }

  isBehind () {
    return this.direction === DIRECTION_TYPE.BEHIND
  }

  isFront () {
    return this.direction === DIRECTION_TYPE.FRONT
  }

  getOffset (start) {
    return (start < 1 ? 0 : this.getIndexOffset(start)) + this.param.slotHeaderSize
  }

  updateParam (key, value) {
    if (this.param && (key in this.param)) {
      if (key === 'uniqueIds' && (value.length < this.param[key].length)) {
        this.sizes.forEach((v, key) => {
          if (!value.includes(key)) {
            this.sizes.delete(key)
          }
        })
      }
      this.param[key] = value
    }
  }

  saveSize (id, size) {
    this.sizes.set(id, size)

    if (this.calcType === CALC_TYPE.INIT) {
      this.fixedSizeValue = size
      this.calcType = CALC_TYPE.FIXED
    } else if (this.calcType === CALC_TYPE.FIXED && this.fixedSizeValue !== size) {
      this.calcType = CALC_TYPE.DYNAMIC
      delete this.fixedSizeValue
    }

    if (this.calcType !== CALC_TYPE.FIXED && typeof this.firstRangeTotalSize !== 'undefined') {
      if (this.sizes.size < Math.min(this.param.keeps, this.param.uniqueIds.length)) {
        this.firstRangeTotalSize = this.firstRangeTotalSize + size
        this.firstRangeAverageSize = Math.round(this.firstRangeTotalSize / this.sizes.size)
      } else {
        delete this.firstRangeTotalSize
      }
    }
  }

  handleDataSourcesChange () {
    let start = this.range.start

    if (this.isFront()) {
      start = start - LEADING_BUFFER
    } else if (this.isBehind()) {
      start = start + LEADING_BUFFER
    }

    start = Math.max(start, 0)

    this.updateRange(this.range.start, this.getEndByStart(start))
  }

  handleSlotSizeChange () {
    this.handleDataSourcesChange()
  }

  handleScroll (offset) {
    this.direction = offset < this.offset ? DIRECTION_TYPE.FRONT : DIRECTION_TYPE.BEHIND
    this.offset = offset

    if (this.direction === DIRECTION_TYPE.FRONT) {
      this.handleFront()
    } else if (this.direction === DIRECTION_TYPE.BEHIND) {
      this.handleBehind()
    }
  }

  // ----------- public method end -----------

  handleFront () {
    const overs = this.getScrollOvers()
    if (overs > this.range.start) {
      return
    }

    const start = Math.max(overs - this.param.buffer, 0)
    this.checkRange(start, this.getEndByStart(start))
  }

  handleBehind () {
    const overs = this.getScrollOvers()
    if (overs < this.range.start + this.param.buffer) {
      return
    }

    this.checkRange(overs, this.getEndByStart(overs))
  }

  getScrollOvers () {
    const offset = this.offset - this.param.slotHeaderSize
    if (offset <= 0) {
      return 0
    }

    if (this.isFixedType()) {
      return Math.floor(offset / this.fixedSizeValue)
    }

    let low = 0
    let middle = 0
    let middleOffset = 0
    let high = this.param.uniqueIds.length

    while (low <= high) {
      middle = low + Math.floor((high - low) / 2)
      middleOffset = this.getIndexOffset(middle)

      if (middleOffset === offset) {
        return middle
      } else if (middleOffset < offset) {
        low = middle + 1
      } else if (middleOffset > offset) {
        high = middle - 1
      }
    }
    return low > 0 ? --low : 0
  }

  getIndexOffset (givenIndex) {
    if (!givenIndex) {
      return 0
    }

    let offset = 0
    let indexSize = 0
    for (let index = 0; index < givenIndex; index++) {
      indexSize = this.sizes.get(this.param.uniqueIds[index])
      offset = offset + (typeof indexSize === 'number' ? indexSize : this.getEstimateSize())
    }

    this.lastCalcIndex = Math.max(this.lastCalcIndex, givenIndex - 1)
    this.lastCalcIndex = Math.min(this.lastCalcIndex, this.getLastIndex())

    return offset
  }

  isFixedType () {
    return this.calcType === CALC_TYPE.FIXED
  }

  getLastIndex () {
    return this.param.uniqueIds.length - 1
  }

  checkRange (start, end) {
    const keeps = this.param.keeps
    const total = this.param.uniqueIds.length

    if (total <= keeps) {
      start = 0
      end = this.getLastIndex()
    } else if (end - start < keeps - 1) {
      start = end - keeps + 1
    }

    if (this.range.start !== start) {
      this.updateRange(start, end)
    }
  }

  updateRange (start, end) {
    this.range.start = start
    this.range.end = end
    this.range.padFront = this.getPadFront()
    this.range.padBehind = this.getPadBehind()
    this.cb(this.getVirtualInfo())
  }

  getEndByStart (start) {
    const theoryEnd = start + this.param.keeps - 1
    const truelyEnd = Math.min(theoryEnd, this.getLastIndex())
    return truelyEnd
  }

  getPadFront () {
    if (this.isFixedType()) {
      return this.fixedSizeValue * this.range.start
    } else {
      return this.getIndexOffset(this.range.start)
    }
  }

  getPadBehind () {
    const end = this.range.end
    const lastIndex = this.getLastIndex()

    if (this.isFixedType()) {
      return (lastIndex - end) * this.fixedSizeValue
    }

    if (this.lastCalcIndex === lastIndex) {
      return this.getIndexOffset(lastIndex) - this.getIndexOffset(end)
    } else {
      return (lastIndex - end) * this.getEstimateSize()
    }
  }

  getEstimateSize () {
    return this.isFixedType() ? this.fixedSizeValue : (this.firstRangeAverageSize || this.param.estimateSize)
  }
}
