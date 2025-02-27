class GradioTextAreaBind {
    constructor(_0x5b2932, _0x1f6762) {
      this.target = document.querySelector(
        '#' + _0x5b2932 + '.' + _0x1f6762 + ' textarea'
      )
      this.sync_lock = false
      this.previousValue = ''
    }
    ['set_value'](_0x5171f) {
      if (this.sync_lock) {
        return
      }
      this.sync_lock = true
      this.target.value = _0x5171f
      this.previousValue = _0x5171f
      let _0x1b13d6 = new Event('input', { bubbles: true })
      Object.defineProperty(_0x1b13d6, 'target', { value: this.target })
      this.target.dispatchEvent(_0x1b13d6)
      this.previousValue = _0x5171f
      this.sync_lock = false
    }
    ['listen'](_0x4c2a9d) {
      setInterval(() => {
        if (this.target.value !== this.previousValue) {
          this.previousValue = this.target.value
          if (this.sync_lock) {
            return
          }
          this.sync_lock = true
          _0x4c2a9d(this.target.value)
          this.sync_lock = false
        }
      }, 100)
    }
  }
  class ForgeCanvas {
    constructor(
      _0x5beeb9,
      _0xea442e = false,
      _0x45532e = false,
      _0x5398d0 = false,
      _0x2a5acb = 512,
      defaultScribbleColor = '#000000',
      lockColor = false,
      defaultScribbleWidth = 4,
      lockWidth = false,
      defaultScribbleAlpha = 100,
      lockAlpha = false,
      defaultScribbleSoftness = 0,
      lockSoftness = false
    ) {
      this.gradio_config = gradio_config
      this.uuid = _0x5beeb9
      this.no_scribbles = _0x45532e
      this.contrast_scribbles = _0x5398d0
      this.no_upload = _0xea442e
      this.initial_height = _0x2a5acb
      this.img = null
      this.imgX = 0
      this.imgY = 0
      this.orgWidth = 0
      this.orgHeight = 0
      this.imgScale = 1
      this.dragging = false
      this.dragged_just_now = false
      this.resizing = false
      this.drawing = false
      this.scribbleColor = defaultScribbleColor
      this.scribbleWidth = defaultScribbleWidth
      this.scribbleAlpha = defaultScribbleAlpha
      this.scribbleSoftness = defaultScribbleSoftness
      this.scribbleColorFixed = lockColor
      this.scribbleWidthFixed = lockWidth
      this.scribbleAlphaFixed = lockAlpha
      this.scribbleSoftnessFixed = lockSoftness
      this.history = []
      this.historyIndex = -1
      this.maximized = false
      this.originalState = {}
      this.contrast_pattern = null
      this.pointerInsideContainer = false
      this.temp_canvas = document.createElement('canvas')
      this.temp_draw_points = []
      this.temp_draw_bg = null
      this.background_gradio_bind = new GradioTextAreaBind(
        this.uuid,
        'logical_image_background'
      )
      this.foreground_gradio_bind = new GradioTextAreaBind(
        this.uuid,
        'logical_image_foreground'
      )
      this.start()
    }
    ['start']() {
      let forgeCanvas = this
      const imageContainer = document.getElementById(
          'imageContainer_' + forgeCanvas.uuid
        ),
        imageElement = document.getElementById('image_' + forgeCanvas.uuid),
        _0xc35a08 = document.getElementById('resizeLine_' + forgeCanvas.uuid),
        _0xef0549 = document.getElementById('container_' + forgeCanvas.uuid),
        _0x2293a4 = document.getElementById('toolbar_' + forgeCanvas.uuid),
        _0x2b661e = document.getElementById('uploadButton_' + forgeCanvas.uuid),
        _0x238c2e = document.getElementById('resetButton_' + forgeCanvas.uuid),
        _0x10e529 = document.getElementById('centerButton_' + forgeCanvas.uuid),
        _0x57ef9e = document.getElementById('removeButton_' + forgeCanvas.uuid),
        _0x16c514 = document.getElementById('undoButton_' + forgeCanvas.uuid),
        _0x3fc10f = document.getElementById('redoButton_' + forgeCanvas.uuid),
        _0x580c6b = document.getElementById('drawingCanvas_' + forgeCanvas.uuid),
        _0x3714ec = document.getElementById('maxButton_' + forgeCanvas.uuid),
        _0x182ad6 = document.getElementById('minButton_' + forgeCanvas.uuid),
        _0x4d9ddb = document.getElementById(
          'scribbleIndicator_' + forgeCanvas.uuid
        ),
        _0x302bda = document.getElementById('uploadHint_' + forgeCanvas.uuid),
        _0xfed598 = document.getElementById('scribbleColor_' + forgeCanvas.uuid),
        _0x34c31c = document.getElementById(
          'scribbleColorBlock_' + forgeCanvas.uuid
        ),
        _0x49f5db = document.getElementById('scribbleWidth_' + forgeCanvas.uuid),
        _0x44d4c0 = document.getElementById('widthLabel_' + forgeCanvas.uuid),
        _0x33c70c = document.getElementById(
          'scribbleWidthBlock_' + forgeCanvas.uuid
        ),
        _0x1ae212 = document.getElementById('scribbleAlpha_' + forgeCanvas.uuid),
        _0x1434c5 = document.getElementById('alphaLabel_' + forgeCanvas.uuid),
        _0xfc1c97 = document.getElementById(
          'scribbleAlphaBlock_' + forgeCanvas.uuid
        ),
        _0x4b344c = document.getElementById('scribbleSoftness_' + forgeCanvas.uuid),
        _0xd693b6 = document.getElementById('softnessLabel_' + forgeCanvas.uuid),
        _0x499f75 = document.getElementById(
          'scribbleSoftnessBlock_' + forgeCanvas.uuid
        )
      _0xfed598.value = forgeCanvas.scribbleColor
      _0x49f5db.value = forgeCanvas.scribbleWidth
      _0x1ae212.value = forgeCanvas.scribbleAlpha
      _0x4b344c.value = forgeCanvas.scribbleSoftness
      const _0x4dde8d = forgeCanvas.scribbleWidth * 20
      _0x4d9ddb.style.width = _0x4dde8d + 'px'
      _0x4d9ddb.style.height = _0x4dde8d + 'px'
      _0xef0549.style.height = forgeCanvas.initial_height + 'px'
      _0x580c6b.width = imageContainer.clientWidth
      _0x580c6b.height = imageContainer.clientHeight
      const _0x4e0dea = _0x580c6b.getContext('2d')
      forgeCanvas.drawingCanvas = _0x580c6b
      forgeCanvas.no_scribbles &&
        ((_0x238c2e.style.display = 'none'),
        (_0x16c514.style.display = 'none'),
        (_0x3fc10f.style.display = 'none'),
        (_0xfed598.style.display = 'none'),
        (_0x34c31c.style.display = 'none'),
        (_0x33c70c.style.display = 'none'),
        (_0xfc1c97.style.display = 'none'),
        (_0x499f75.style.display = 'none'),
        (_0x4d9ddb.style.display = 'none'),
        (_0x580c6b.style.display = 'none'))
      forgeCanvas.no_upload &&
        ((_0x2b661e.style.display = 'none'), (_0x302bda.style.display = 'none'))
      if (forgeCanvas.contrast_scribbles) {
        _0x34c31c.style.display = 'none'
        _0xfc1c97.style.display = 'none'
        _0x499f75.style.display = 'none'
        const _0x34ac43 = forgeCanvas.temp_canvas
        _0x34ac43.width = 20
        _0x34ac43.height = 20
        const _0x33c46f = _0x34ac43.getContext('2d')
        _0x33c46f.fillStyle = '#ffffff'
        _0x33c46f.fillRect(0, 0, 10, 10)
        _0x33c46f.fillRect(10, 10, 10, 10)
        _0x33c46f.fillStyle = '#000000'
        _0x33c46f.fillRect(10, 0, 10, 10)
        _0x33c46f.fillRect(0, 10, 10, 10)
        forgeCanvas.contrast_pattern = _0x4e0dea.createPattern(_0x34ac43, 'repeat')
        _0x580c6b.style.opacity = '0.5'
      }
      ;(forgeCanvas.contrast_scribbles ||
        (forgeCanvas.scribbleColorFixed &&
          forgeCanvas.scribbleAlphaFixed &&
          forgeCanvas.scribbleSoftnessFixed)) &&
        ((_0x33c70c.style.width = '100%'),
        (_0x49f5db.style.width = '100%'),
        (_0x44d4c0.style.display = 'none'))
      forgeCanvas.scribbleColorFixed && (_0x34c31c.style.display = 'none')
      forgeCanvas.scribbleWidthFixed && (_0x33c70c.style.display = 'none')
      forgeCanvas.scribbleAlphaFixed && (_0xfc1c97.style.display = 'none')
      forgeCanvas.scribbleSoftnessFixed && (_0x499f75.style.display = 'none')
      const _0x188690 = new ResizeObserver(() => {
        forgeCanvas.adjustInitialPositionAndScale()
        forgeCanvas.drawImage()
      })
      _0x188690.observe(_0xef0549)
      document
        .getElementById('imageInput_' + forgeCanvas.uuid)
        .addEventListener('change', function (_0x1a058f) {
          forgeCanvas.handleFileUpload(_0x1a058f.target.files[0])
        })
      _0x2b661e.addEventListener('click', function () {
        if (forgeCanvas.no_upload) {
          return
        }
        document.getElementById('imageInput_' + forgeCanvas.uuid).click()
      })
      _0x238c2e.addEventListener('click', function () {
        forgeCanvas.resetImage()
      })
      _0x10e529.addEventListener('click', function () {
        forgeCanvas.adjustInitialPositionAndScale()
        forgeCanvas.drawImage()
      })
      _0x57ef9e.addEventListener('click', function () {
        forgeCanvas.removeImage()
      })
      _0x16c514.addEventListener('click', function () {
        forgeCanvas.undo()
      })
      _0x3fc10f.addEventListener('click', function () {
        forgeCanvas.redo()
      })
      _0xfed598.addEventListener('input', function () {
        forgeCanvas.scribbleColor = this.value
        _0x4d9ddb.style.borderColor = forgeCanvas.scribbleColor
      })
      _0x49f5db.addEventListener('input', function () {
        forgeCanvas.scribbleWidth = this.value
        const _0x176e47 = forgeCanvas.scribbleWidth * 20
        _0x4d9ddb.style.width = _0x176e47 + 'px'
        _0x4d9ddb.style.height = _0x176e47 + 'px'
      })
      _0x1ae212.addEventListener('input', function () {
        forgeCanvas.scribbleAlpha = this.value
      })
      _0x4b344c.addEventListener('input', function () {
        forgeCanvas.scribbleSoftness = this.value
      })
      _0x580c6b.addEventListener('pointerdown', function (_0x4e467a) {
        if (!forgeCanvas.img || _0x4e467a.button !== 0 || forgeCanvas.no_scribbles) {
          return
        }
        const _0x3e57e6 = _0x580c6b.getBoundingClientRect()
        forgeCanvas.drawing = true
        _0x580c6b.style.cursor = 'crosshair'
        _0x4d9ddb.style.display = 'none'
        forgeCanvas.temp_draw_points = [
          [
            (_0x4e467a.clientX - _0x3e57e6.left) / forgeCanvas.imgScale,
            (_0x4e467a.clientY - _0x3e57e6.top) / forgeCanvas.imgScale,
          ],
        ]
        forgeCanvas.temp_draw_bg = _0x4e0dea.getImageData(
          0,
          0,
          _0x580c6b.width,
          _0x580c6b.height
        )
        forgeCanvas.handleDraw(_0x4e467a)
      })
      _0x580c6b.addEventListener('pointermove', function (_0x2acad5) {
        forgeCanvas.drawing && forgeCanvas.handleDraw(_0x2acad5)
        forgeCanvas.img &&
          !forgeCanvas.dragging &&
          (_0x580c6b.style.cursor = 'crosshair')
        if (
          forgeCanvas.img &&
          !forgeCanvas.drawing &&
          !forgeCanvas.dragging &&
          !forgeCanvas.no_scribbles
        ) {
          const _0x47c4c4 = imageContainer.getBoundingClientRect(),
            _0x52af84 = forgeCanvas.scribbleWidth * 10
          _0x4d9ddb.style.left =
            _0x2acad5.clientX - _0x47c4c4.left - _0x52af84 + 'px'
          _0x4d9ddb.style.top =
            _0x2acad5.clientY - _0x47c4c4.top - _0x52af84 + 'px'
          _0x4d9ddb.style.display = 'block'
        }
      })
      _0x580c6b.addEventListener('pointerup', function () {
        forgeCanvas.drawing = false
        _0x580c6b.style.cursor = ''
        forgeCanvas.saveState()
      })
      _0x580c6b.addEventListener('pointerleave', function () {
        forgeCanvas.drawing = false
        _0x580c6b.style.cursor = ''
        _0x4d9ddb.style.display = 'none'
      })
      _0x2293a4.addEventListener('pointerdown', function (_0x67876) {
        _0x67876.stopPropagation()
      })
      imageContainer.addEventListener('pointerdown', function (_0x16bd10) {
        const _0x3b1aec = imageContainer.getBoundingClientRect(),
          _0x13e875 = _0x16bd10.clientX - _0x3b1aec.left,
          _0x1f3529 = _0x16bd10.clientY - _0x3b1aec.top
        if (
          _0x16bd10.button === 2 &&
          forgeCanvas.isInsideImage(_0x13e875, _0x1f3529)
        ) {
          forgeCanvas.dragging = true
          forgeCanvas.offsetX = _0x13e875 - forgeCanvas.imgX
          forgeCanvas.offsetY = _0x1f3529 - forgeCanvas.imgY
          imageElement.style.cursor = 'grabbing'
          _0x580c6b.style.cursor = 'grabbing'
          _0x4d9ddb.style.display = 'none'
        } else {
          _0x16bd10.button === 0 &&
            !forgeCanvas.img &&
            !forgeCanvas.no_upload &&
            document.getElementById('imageInput_' + forgeCanvas.uuid).click()
        }
      })
      imageContainer.addEventListener('pointermove', function (_0x3ccb2c) {
        if (forgeCanvas.dragging) {
          const _0x395c46 = imageContainer.getBoundingClientRect(),
            _0x43762a = _0x3ccb2c.clientX - _0x395c46.left,
            _0x5dc7f6 = _0x3ccb2c.clientY - _0x395c46.top
          forgeCanvas.imgX = _0x43762a - forgeCanvas.offsetX
          forgeCanvas.imgY = _0x5dc7f6 - forgeCanvas.offsetY
          forgeCanvas.drawImage()
          forgeCanvas.dragged_just_now = true
        }
      })
      imageContainer.addEventListener('pointerup', function (_0x47de48) {
        forgeCanvas.dragging && forgeCanvas.handleDragEnd(_0x47de48, false)
      })
      imageContainer.addEventListener('pointerleave', function (_0x4065ae) {
        forgeCanvas.dragging && forgeCanvas.handleDragEnd(_0x4065ae, true)
      })
      imageContainer.addEventListener('wheel', function (_0x23bd08) {
        if (!forgeCanvas.img) {
          return
        }
        _0x23bd08.preventDefault()
        const _0x1a4888 = imageContainer.getBoundingClientRect(),
          _0x1810eb = _0x23bd08.clientX - _0x1a4888.left,
          _0x53a88f = _0x23bd08.clientY - _0x1a4888.top,
          _0x453af7 = forgeCanvas.imgScale,
          _0x13a559 = _0x23bd08.deltaY * -0.001
        forgeCanvas.imgScale += _0x13a559
        forgeCanvas.imgScale = Math.max(0.1, forgeCanvas.imgScale)
        const _0x5efca8 = forgeCanvas.imgScale / _0x453af7
        forgeCanvas.imgX = _0x1810eb - (_0x1810eb - forgeCanvas.imgX) * _0x5efca8
        forgeCanvas.imgY = _0x53a88f - (_0x53a88f - forgeCanvas.imgY) * _0x5efca8
        forgeCanvas.drawImage()
      })
      imageContainer.addEventListener('contextmenu', function (_0xada892) {
        forgeCanvas.dragged_just_now && _0xada892.preventDefault()
        forgeCanvas.dragged_just_now = false
      })
      imageContainer.addEventListener('pointerover', function () {
        _0x2293a4.style.opacity = '1'
        !forgeCanvas.img &&
          !forgeCanvas.no_upload &&
          (imageContainer.style.cursor = 'pointer')
      })
      imageContainer.addEventListener('pointerout', function () {
        _0x2293a4.style.opacity = '0'
        imageElement.style.cursor = ''
        _0x580c6b.style.cursor = ''
        imageContainer.style.cursor = ''
        _0x4d9ddb.style.display = 'none'
      })
      _0xc35a08.addEventListener('pointerdown', function (_0x30abb1) {
        forgeCanvas.resizing = true
        _0x30abb1.preventDefault()
        _0x30abb1.stopPropagation()
      })
      document.addEventListener('pointermove', function (_0x4c9e76) {
        if (forgeCanvas.resizing) {
          const _0x50e8b7 = _0xef0549.getBoundingClientRect(),
            _0x3c2a2d = _0x4c9e76.clientY - _0x50e8b7.top
          _0xef0549.style.height = _0x3c2a2d + 'px'
          _0x4c9e76.preventDefault()
          _0x4c9e76.stopPropagation()
        }
      })
      document.addEventListener('pointerup', function () {
        forgeCanvas.resizing = false
      })
      document.addEventListener('pointerleave', function () {
        forgeCanvas.resizing = false
      })
      ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach((_0x493b3f) => {
        imageContainer.addEventListener(_0x493b3f, _0x14ddf0, false)
      })
      function _0x14ddf0(_0x1a6add) {
        _0x1a6add.preventDefault()
        _0x1a6add.stopPropagation()
      }
      imageContainer.addEventListener('dragenter', () => {
        imageElement.style.cursor = 'copy'
        _0x580c6b.style.cursor = 'copy'
      })
      imageContainer.addEventListener('dragleave', () => {
        imageElement.style.cursor = ''
        _0x580c6b.style.cursor = ''
      })
      imageContainer.addEventListener('drop', function (_0x527b6e) {
        imageElement.style.cursor = ''
        _0x580c6b.style.cursor = ''
        const _0x323886 = _0x527b6e.dataTransfer,
          _0x173d8d = _0x323886.files
        _0x173d8d.length > 0 && forgeCanvas.handleFileUpload(_0x173d8d[0])
      })
      imageContainer.addEventListener('pointerenter', () => {
        forgeCanvas.pointerInsideContainer = true
      })
      imageContainer.addEventListener('pointerleave', () => {
        forgeCanvas.pointerInsideContainer = false
      })
      document.addEventListener('paste', function (_0x2a4116) {
        forgeCanvas.pointerInsideContainer && forgeCanvas.handlePaste(_0x2a4116)
      })
      document.addEventListener('keydown', (_0x36507c) => {
        if (!forgeCanvas.pointerInsideContainer) {
          return
        }
        _0x36507c.ctrlKey &&
          _0x36507c.key === 'z' &&
          (_0x36507c.preventDefault(), this.undo())
        _0x36507c.ctrlKey &&
          _0x36507c.key === 'y' &&
          (_0x36507c.preventDefault(), this.redo())
      })
      _0x3714ec.addEventListener('click', function () {
        forgeCanvas.maximize()
      })
      _0x182ad6.addEventListener('click', function () {
        forgeCanvas.minimize()
      })
      forgeCanvas.updateUndoRedoButtons()
      forgeCanvas.background_gradio_bind.listen(function (_0x5e4baf) {
        forgeCanvas.uploadBase64(_0x5e4baf)
      })
      forgeCanvas.foreground_gradio_bind.listen(function (_0x38888c) {
        forgeCanvas.uploadBase64DrawingCanvas(_0x38888c)
      })
    }
    ['handleDraw'](_0x38dcae) {
      const _0x22be38 = this.drawingCanvas,
        _0x53158c = _0x22be38.getContext('2d'),
        _0x1af416 = _0x22be38.getBoundingClientRect(),
        _0x2e21ab = (_0x38dcae.clientX - _0x1af416.left) / this.imgScale,
        _0x454251 = (_0x38dcae.clientY - _0x1af416.top) / this.imgScale
      this.temp_draw_points.push([_0x2e21ab, _0x454251])
      _0x53158c.putImageData(this.temp_draw_bg, 0, 0)
      _0x53158c.beginPath()
      _0x53158c.moveTo(this.temp_draw_points[0][0], this.temp_draw_points[0][1])
      for (
        let _0x26f36c = 1;
        _0x26f36c < this.temp_draw_points.length;
        _0x26f36c++
      ) {
        _0x53158c.lineTo(
          this.temp_draw_points[_0x26f36c][0],
          this.temp_draw_points[_0x26f36c][1]
        )
      }
      _0x53158c.lineCap = 'round'
      _0x53158c.lineJoin = 'round'
      _0x53158c.lineWidth = (this.scribbleWidth / this.imgScale) * 20
      if (this.contrast_scribbles) {
        _0x53158c.strokeStyle = this.contrast_pattern
        _0x53158c.stroke()
        return
      }
      _0x53158c.strokeStyle = this.scribbleColor
      if (!(this.scribbleAlpha > 0)) {
        _0x53158c.globalCompositeOperation = 'destination-out'
        _0x53158c.globalAlpha = 1
        _0x53158c.stroke()
        return
      }
      _0x53158c.globalCompositeOperation = 'source-over'
      if (!(this.scribbleSoftness > 0)) {
        _0x53158c.globalAlpha = this.scribbleAlpha / 100
        _0x53158c.stroke()
        return
      }
      const _0x27eac4 = _0x53158c.lineWidth * (1 - this.scribbleSoftness / 150),
        _0x5e0a52 = _0x53158c.lineWidth * (1 + this.scribbleSoftness / 150),
        _0x5291ff = Math.round(5 + this.scribbleSoftness / 5),
        _0x51c9f4 = (_0x5e0a52 - _0x27eac4) / (_0x5291ff - 1)
      _0x53158c.globalAlpha =
        1 - Math.pow(1 - Math.min(this.scribbleAlpha / 100, 0.95), 1 / _0x5291ff)
      for (let _0x1961da = 0; _0x1961da < _0x5291ff; _0x1961da++) {
        _0x53158c.lineWidth = _0x27eac4 + _0x51c9f4 * _0x1961da
        _0x53158c.stroke()
      }
    }
    ['handleFileUpload'](_0x18e24e) {
      if (_0x18e24e && !this.no_upload) {
        const _0x17eca1 = new FileReader()
        _0x17eca1.onload = (_0x3e5df9) => {
          this.uploadBase64(_0x3e5df9.target.result)
        }
        _0x17eca1.readAsDataURL(_0x18e24e)
      }
    }
    ['handlePaste'](_0xced005) {
      const _0x48e978 = _0xced005.clipboardData.items
      for (let _0x22bd31 = 0; _0x22bd31 < _0x48e978.length; _0x22bd31++) {
        const _0x42774a = _0x48e978[_0x22bd31]
        if (_0x42774a.type.indexOf('image') !== -1) {
          const _0x4d8fe1 = _0x42774a.getAsFile()
          this.handleFileUpload(_0x4d8fe1)
          break
        }
      }
    }
    ['uploadBase64'](_0xc39b50) {
      if (typeof this.gradio_config !== 'undefined') {
        if (!this.gradio_config.version.startsWith('4')) {
          return
        }
      } else {
        return
      }
      const _0xd22fe = new Image()
      _0xd22fe.onload = () => {
        this.img = _0xc39b50
        this.orgWidth = _0xd22fe.width
        this.orgHeight = _0xd22fe.height
        const _0x2c290a = document.getElementById('drawingCanvas_' + this.uuid)
        ;(_0x2c290a.width !== _0xd22fe.width ||
          _0x2c290a.height !== _0xd22fe.height) &&
          ((_0x2c290a.width = _0xd22fe.width),
          (_0x2c290a.height = _0xd22fe.height))
        this.adjustInitialPositionAndScale()
        this.drawImage()
        this.on_img_upload()
        this.saveState()
        document.getElementById('imageInput_' + this.uuid).value = null
        document.getElementById('uploadHint_' + this.uuid).style.display = 'none'
      }
      if (_0xc39b50) {
        _0xd22fe.src = _0xc39b50
      } else {
        this.img = null
        const _0x129c29 = document.getElementById('drawingCanvas_' + this.uuid)
        _0x129c29.width = 1
        _0x129c29.height = 1
        this.adjustInitialPositionAndScale()
        this.drawImage()
        this.on_img_upload()
        this.saveState()
      }
    }
    ['uploadBase64DrawingCanvas'](_0x2ea541) {
      const _0x492368 = new Image()
      _0x492368.onload = () => {
        const _0x1a67bb = document.getElementById('drawingCanvas_' + this.uuid),
          _0x3dd3e9 = _0x1a67bb.getContext('2d')
        _0x3dd3e9.clearRect(0, 0, _0x1a67bb.width, _0x1a67bb.height)
        _0x3dd3e9.drawImage(_0x492368, 0, 0)
        this.saveState()
      }
      if (_0x2ea541) {
        _0x492368.src = _0x2ea541
      } else {
        const _0x4d6787 = document.getElementById('drawingCanvas_' + this.uuid),
          _0x38cdfe = _0x4d6787.getContext('2d')
        _0x38cdfe.clearRect(0, 0, _0x4d6787.width, _0x4d6787.height)
        this.saveState()
      }
    }
    ['isInsideImage'](_0x3374f1, _0x5dfbdc) {
      const _0x4597fc = this.orgWidth * this.imgScale,
        _0x45a929 = this.orgHeight * this.imgScale
      return (
        _0x3374f1 > this.imgX &&
        _0x3374f1 < this.imgX + _0x4597fc &&
        _0x5dfbdc > this.imgY &&
        _0x5dfbdc < this.imgY + _0x45a929
      )
    }
    ['drawImage']() {
      const _0x193f60 = document.getElementById('image_' + this.uuid),
        _0x91ace9 = document.getElementById('drawingCanvas_' + this.uuid)
      if (this.img) {
        const _0x46cd11 = this.orgWidth * this.imgScale,
          _0x1c2888 = this.orgHeight * this.imgScale
        _0x193f60.src = this.img
        _0x193f60.style.width = _0x46cd11 + 'px'
        _0x193f60.style.height = _0x1c2888 + 'px'
        _0x193f60.style.left = this.imgX + 'px'
        _0x193f60.style.top = this.imgY + 'px'
        _0x193f60.style.display = 'block'
        _0x91ace9.style.width = _0x46cd11 + 'px'
        _0x91ace9.style.height = _0x1c2888 + 'px'
        _0x91ace9.style.left = this.imgX + 'px'
        _0x91ace9.style.top = this.imgY + 'px'
      } else {
        _0x193f60.src = ''
        _0x193f60.style.display = 'none'
      }
    }
    ['adjustInitialPositionAndScale']() {
      const _0x31a7a9 = document.getElementById('imageContainer_' + this.uuid),
        _0x3e4550 = _0x31a7a9.clientWidth - 32,
        _0x3d12ed = _0x31a7a9.clientHeight - 32,
        _0x452c06 = _0x3e4550 / this.orgWidth,
        _0x33f779 = _0x3d12ed / this.orgHeight
      this.imgScale = Math.min(_0x452c06, _0x33f779)
      const _0x34b48b = this.orgWidth * this.imgScale,
        _0x522d0b = this.orgHeight * this.imgScale
      this.imgX = (_0x31a7a9.clientWidth - _0x34b48b) / 2
      this.imgY = (_0x31a7a9.clientHeight - _0x522d0b) / 2
    }
    ['resetImage']() {
      const _0x29fc58 = document.getElementById('drawingCanvas_' + this.uuid),
        _0xab373b = _0x29fc58.getContext('2d')
      _0xab373b.clearRect(0, 0, _0x29fc58.width, _0x29fc58.height)
      this.adjustInitialPositionAndScale()
      this.drawImage()
      this.saveState()
    }
    ['removeImage']() {
      this.img = null
      const _0x5cbdb5 = document.getElementById('image_' + this.uuid),
        _0x53de58 = document.getElementById('drawingCanvas_' + this.uuid),
        _0x2b3607 = _0x53de58.getContext('2d')
      _0x2b3607.clearRect(0, 0, _0x53de58.width, _0x53de58.height)
      _0x5cbdb5.src = ''
      _0x5cbdb5.style.width = '0'
      _0x5cbdb5.style.height = '0'
      this.saveState()
      !this.no_upload &&
        (document.getElementById('uploadHint_' + this.uuid).style.display =
          'block')
      this.on_img_upload()
    }
    ['saveState']() {
      const _0x509166 = document.getElementById('drawingCanvas_' + this.uuid),
        _0x2e739b = _0x509166.getContext('2d'),
        _0x540cea = _0x2e739b.getImageData(
          0,
          0,
          _0x509166.width,
          _0x509166.height
        )
      this.history = this.history.slice(0, this.historyIndex + 1)
      this.history.push(_0x540cea)
      this.historyIndex++
      this.updateUndoRedoButtons()
      this.on_drawing_canvas_upload()
    }
    ['undo']() {
      this.historyIndex > 0 &&
        (this.historyIndex--, this.restoreState(), this.updateUndoRedoButtons())
    }
    ['redo']() {
      this.historyIndex < this.history.length - 1 &&
        (this.historyIndex++, this.restoreState(), this.updateUndoRedoButtons())
    }
    ['restoreState']() {
      const _0xd39c5d = document.getElementById('drawingCanvas_' + this.uuid),
        _0x1c14e7 = _0xd39c5d.getContext('2d'),
        _0x2d1e7a = this.history[this.historyIndex]
      _0x1c14e7.putImageData(_0x2d1e7a, 0, 0)
      this.on_drawing_canvas_upload()
    }
    ['updateUndoRedoButtons']() {
      const _0x351d4c = document.getElementById('undoButton_' + this.uuid),
        _0xe0a49c = document.getElementById('redoButton_' + this.uuid)
      _0x351d4c.disabled = this.historyIndex <= 0
      _0xe0a49c.disabled = this.historyIndex >= this.history.length - 1
      _0x351d4c.style.opacity = _0x351d4c.disabled ? '0.5' : '1'
      _0xe0a49c.style.opacity = _0xe0a49c.disabled ? '0.5' : '1'
    }
    ['on_img_upload']() {
      if (!this.img) {
        this.background_gradio_bind.set_value('')
        return
      }
      const _0x2fe475 = document.getElementById('image_' + this.uuid),
        _0x1d819f = this.temp_canvas,
        _0x18fef1 = _0x1d819f.getContext('2d')
      _0x1d819f.width = this.orgWidth
      _0x1d819f.height = this.orgHeight
      _0x18fef1.drawImage(_0x2fe475, 0, 0, this.orgWidth, this.orgHeight)
      const _0xe7fdcd = _0x1d819f.toDataURL('image/png')
      this.background_gradio_bind.set_value(_0xe7fdcd)
    }
    ['on_drawing_canvas_upload']() {
      if (!this.img) {
        this.foreground_gradio_bind.set_value('')
        return
      }
      const _0x187231 = document.getElementById('drawingCanvas_' + this.uuid),
        _0x577555 = _0x187231.toDataURL('image/png')
      this.foreground_gradio_bind.set_value(_0x577555)
    }
    ['maximize']() {
      if (this.maximized) {
        return
      }
      const _0x4fe2b7 = document.getElementById('container_' + this.uuid),
        _0x4177f5 = document.getElementById('toolbar_' + this.uuid),
        _0x54331a = document.getElementById('maxButton_' + this.uuid),
        _0x553769 = document.getElementById('minButton_' + this.uuid)
      this.originalState = {
        width: _0x4fe2b7.style.width,
        height: _0x4fe2b7.style.height,
        top: _0x4fe2b7.style.top,
        left: _0x4fe2b7.style.left,
        position: _0x4fe2b7.style.position,
        zIndex: _0x4fe2b7.style.zIndex,
      }
      _0x4fe2b7.style.width = '100vw'
      _0x4fe2b7.style.height = '100vh'
      _0x4fe2b7.style.top = '0'
      _0x4fe2b7.style.left = '0'
      _0x4fe2b7.style.position = 'fixed'
      _0x4fe2b7.style.zIndex = '1000'
      _0x54331a.style.display = 'none'
      _0x553769.style.display = 'inline-block'
      this.maximized = true
    }
    ['minimize']() {
      if (!this.maximized) {
        return
      }
      const _0x21a23f = document.getElementById('container_' + this.uuid),
        _0x7b3c58 = document.getElementById('maxButton_' + this.uuid),
        _0x162e20 = document.getElementById('minButton_' + this.uuid)
      _0x21a23f.style.width = this.originalState.width
      _0x21a23f.style.height = this.originalState.height
      _0x21a23f.style.top = this.originalState.top
      _0x21a23f.style.left = this.originalState.left
      _0x21a23f.style.position = this.originalState.position
      _0x21a23f.style.zIndex = this.originalState.zIndex
      _0x7b3c58.style.display = 'inline-block'
      _0x162e20.style.display = 'none'
      this.maximized = false
    }
    ['handleDragEnd'](_0x3648cb, _0x453b8b) {
      const _0x269d7c = document.getElementById('image_' + this.uuid),
        _0x692a8a = document.getElementById('drawingCanvas_' + this.uuid)
      this.dragging = false
      _0x269d7c.style.cursor = 'grab'
      _0x692a8a.style.cursor = 'grab'
    }
  }
  const True = true,
    False = false
  