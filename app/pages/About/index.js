import GSAP from 'gsap'

import clamp from 'lodash/clamp'
import each from 'lodash/each'

import Page from 'components/Page'

import { getOffset } from 'utils/dom'

export default class extends Page {
  constructor () {
    super({
      classes: {
        buttonActive: 'home__button--active'
      },
      element: '.about',
      elements: {
        title: '.about__header__title',
        titles: '.about__header__title__text span',
        sections: '.about__section',
        sectionsTitles: '.about__section__title'
      },
      isScrollable: true
    })

    this.create()
  }

  /**
   * Animations.
   */
  show () {
    const timeline = GSAP.timeline()

    timeline.call(_ => {
      this.onResize()
    })

    timeline.set(this.element, {
      autoAlpha: 1
    })

    timeline.set(this.elements.title, {
      autoAlpha: 1
    })

    GSAP.fromTo(this.elements.titles, {
      y: '100%'
    }, {
      duration: 1.5,
      ease: 'expo.out',
      stagger: 0.1,
      y: '0%'
    })

    timeline.call(_ => {
      this.update()
    })

    return super.show(timeline)
  }

  hide () {
    const timeline = GSAP.timeline()

    timeline.to(this.element, {
      autoAlpha: 0,
      duration: 0.33
    })

    timeline.call(_ => {
      window.cancelAnimationFrame(this.frame)
    })

    return super.show(timeline)
  }

  /**
   * Create.
   */
  onResize () {
    super.onResize()

    each(this.elements.sectionsTitles, title => {
      title.start = getOffset(title.parentNode).top
      title.limit = title.parentNode.clientHeight - title.clientHeight
    })

    each(this.elements.sectionsTitles, title => {
      const distance = clamp(this.scroll.last - title.start, 0, title.limit)

      title.style.transform = `translateY(${distance}px)`
    })
  }

  /**
   * Loop.
   */
  update () {
    super.update()

    each(this.elements.sectionsTitles, title => {
      const distance = clamp(this.scroll.last - title.start, 0, title.limit)

      title.style.transform = `translateY(${distance}px)`
    })

    this.frame = window.requestAnimationFrame(this.update)
  }
}