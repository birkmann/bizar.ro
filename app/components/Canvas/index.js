import { Renderer, Camera, Transform, Plane, Post, Vec2 } from 'ogl'
import FontFaceObserver from 'fontfaceobserver'

import fragment from 'shaders/post.glsl'

import { mapEach } from 'utils/dom'

import Media from './Media'

export default class {
  constructor () {
    this.background = {
      r: 21,
      g: 28,
      b: 19
    }

    this.renderer = new Renderer()
    this.gl = this.renderer.gl

    this.resolution = {
      value: new Vec2()
    }

    this.planeGeometry = new Plane(this.gl, {
      widthSegments: 20
    })

    document.body.appendChild(this.gl.canvas)

    this.createCamera()
    this.createScene()
    this.createPost()

    this.onResize()

    this.createList()
  }

  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 5
  }

  createScene () {
    this.scene = new Transform()
  }

  createPost () {
    this.post = new Post(this.gl)

    this.pass = this.post.addPass({
      fragment,
      uniforms: {
        uResolution: this.resolution,
      },
  });
  }

  createList () {
    const font = new FontFaceObserver('Ampersand')

    font.load().then(_ => {
      this.mediasElements = document.querySelectorAll('.home__item')
      this.medias = mapEach(this.mediasElements, (homeItem, index) => {
        const homeLink = homeItem.querySelector('.home__link')
        const homeLinkMedia = homeItem.querySelector('.home__link__media')

        const id = homeLink.href.replace(`${window.location.origin}/case/`, '')
        const caseMedia = document.querySelector(`#${id} .case__media`)

        let media = new Media({
          caseMedia,
          geometry: this.planeGeometry,
          gl: this.gl,
          homeItem,
          homeLink,
          homeLinkMedia,
          id,
          scene: this.scene,
          screen: this.screen,
          viewport: this.viewport
        })

        return media
      })
    })
  }

  /**
   * Change.
   */
  onChange (url) {
    if (url.indexOf('/case') > -1) {
      const id = url.replace('/case/', '')
      const media = this.medias.find(media => media.id === id)

      media.open()
    } else {
      this.medias.forEach(media => media.close())
    }
  }

  /**
   * Touch.
   */
  onTouchDown (event) {

  }

  onTouchMove (event) {

  }

  onTouchUp (event) {

  }

  /**
   * Wheel.
   */
  onWheel (event) {

  }

  /**
   * Resize.
   */
  onResize () {
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    this.renderer.setSize(this.screen.width, this.screen.height)

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    })

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.viewport = {
      height,
      width
    }

    this.post.resize()

    this.resolution.value.set(this.gl.canvas.width, this.gl.canvas.height)

    if (this.medias) {
      this.medias.forEach(media => media.onResize({
        screen: this.screen,
        viewport: this.viewport
      }))
    }
  }

  /**
   * Update.
   */
  update (scroll) {
    this.gl.clearColor(this.background.r / 255, this.background.g / 255, this.background.b / 255, 1)

    this.post.render({
      scene: this.scene,
      camera: this.camera
    })

    if (this.medias) {
      this.medias.forEach(media => {
        media.update(scroll, this.mediasElements)
      })
    }
  }
}