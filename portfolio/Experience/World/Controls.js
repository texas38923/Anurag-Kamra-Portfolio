import Experience from '../Experience.js';
import * as THREE from 'three';
import GSAP from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import ASScroll from '@ashthornton/asscroll';

export default class Room {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.camera = this.experience.camera;
    this.room = this.experience.world.room.actualRoom;
    this.room.children.forEach((child) => {
      if (child.type === 'RectAreaLight') {
        this.rectLight = child;
      }
    });

    GSAP.registerPlugin(ScrollTrigger);

    this.setSmoothScroll();
    this.setScrollTrigger();
  }

  setupASScroll() {
    // https://github.com/ashthornton/asscroll
    const asscroll = new ASScroll({
      ease: 0.1,
      disableRaf: true,
    });

    GSAP.ticker.add(asscroll.update);

    ScrollTrigger.defaults({
      scroller: asscroll.containerElement,
    });

    ScrollTrigger.scrollerProxy(asscroll.containerElement, {
      scrollTop(value) {
        if (arguments.length) {
          asscroll.currentPos = value;
          return;
        }
        return asscroll.currentPos;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      fixedMarkers: true,
    });

    asscroll.on('update', ScrollTrigger.update);
    ScrollTrigger.addEventListener('refresh', asscroll.resize);

    requestAnimationFrame(() => {
      asscroll.enable({
        newScrollElements: document.querySelectorAll(
          '.gsap-marker-start, .gsap-marker-end, [asscroll]'
        ),
      });
    });
    return asscroll;
  }

  setSmoothScroll() {
    this.asscroll = this.setupASScroll();
  }

  setScrollTrigger() {
    ScrollTrigger.matchMedia({
      // desktop:
      '(min-width: 969px)': () => {
        this.room.scale.set(0.11, 0.11, 0.11);
        this.rectLight.width = 0.5;
        this.rectLight.height = 0.7;

        //First Section-------------------------------------------
        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.64,
            invalidateOnRefresh: true,
          },
        });

        this.firstMoveTimeline.to(this.room.position, {
          x: () => {
            return this.sizes.width * 0.0014;
          },
        });

        //Second Section-------------------------------------------
        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.64,
            invalidateOnRefresh: true,
          },
        });

        this.secondMoveTimeline.to(
          this.room.position,
          {
            x: () => {
              return 1;
            },
            z: () => {
              return this.sizes.height * 0.0032;
            },
          },
          'same'
        );

        this.secondMoveTimeline.to(
          this.room.scale,
          {
            x: 0.4,
            y: 0.4,
            z: 0.4,
          },
          'same'
        );
        this.secondMoveTimeline.to(
          this.rectLight,
          {
            width: 0.5 * 4,
            height: 0.5 * 4,
          },
          'same'
        );

        //Third Section-------------------------------------------
        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.64,
            invalidateOnRefresh: true,
          },
        });

        this.thirdMoveTimeline.to(this.camera.orthographicCamera.position, {
          y: 1.5,
          y: -4.1,
        });
      },

      // mobile:
      '(max-width: 968px)': () => {
        //resets:
        this.room.scale.set(0.07, 0.07, 0.07);
        this.room.position.set(0, 0, 0);
        this.rectLight.width = 0.3;
        this.rectLight.height = 0.4;

        //First Section-------------------------------------------
        this.firstMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.first-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.64,
            invalidateOnRefresh: true,
          },
        }).to(this.room.scale, {
          x: 0.1,
          y: 0.1,
          z: 0.1,
        });

        //Second Section-------------------------------------------
        this.secondMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.second-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.64,
            invalidateOnRefresh: true,
          },
        })
          .to(
            this.room.scale,
            {
              x: 0.25,
              y: 0.25,
              z: 0.25,
            },
            'same'
          )
          .to(
            this.rectLight,
            {
              width: 0.3 * 3.4,
              height: 0.4 * 3.4,
            },
            'same'
          )
          .to(
            this.room.position,
            {
              x: 1.5,
            },
            'same'
          );

        //Third Section-------------------------------------------
        this.thirdMoveTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.64,
            invalidateOnRefresh: true,
          },
        }).to(this.room.position, {
          z: -4.5,
        });
      },

      // all
      all: () => {
        //
        this.sections = document.querySelectorAll('.section');
        this.sections.forEach((section) => {
          this.progressWrapper = section.querySelector('.progress-wrapper');
          this.progressBar = section.querySelector('.progress-bar');

          if (section.classList.contains('right')) {
            GSAP.to(section, {
              borderTopLeftRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.64,
              },
            });
            GSAP.to(section, {
              borderBottomLeftRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 0.64,
              },
            });
          } else {
            GSAP.to(section, {
              borderTopRightRadius: 10,
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.64,
              },
            });
            GSAP.to(section, {
              borderBottomRightRadius: 700,
              scrollTrigger: {
                trigger: section,
                start: 'bottom bottom',
                end: 'bottom top',
                scrub: 0.64,
              },
            });
          }

          GSAP.from(this.progressBar, {
            scaleY: 0,
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.46,
              pin: this.progressWrapper,
              pinSpacing: false,
            },
          });
        });

        //mini platform animations:
        this.secondPartTimeline = new GSAP.timeline({
          scrollTrigger: {
            trigger: '.third-move',
            start: 'center center',
            end: 'bottom bottom',
            scrub: 0.64,
            invalidateOnRefresh: true,
          },
        });

        this.room.children.forEach((child) => {
          if (child.name === 'Mini_Floor') {
            this.first = GSAP.to(child.position, {
              x: -5.44055,
              z: 13.6135,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
          if (child.name === 'Mailbox') {
            this.second = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
          if (child.name === 'Lamp') {
            this.third = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
          if (child.name === 'FloorFirst') {
            this.fourth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
          if (child.name === 'FloorSecond') {
            this.fifth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              duration: 0.3,
            });
          }
          if (child.name === 'FloorThird') {
            this.sixth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
          if (child.name === 'Dirt') {
            this.seventh = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
          if (child.name === 'Flower1') {
            this.eighth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
          if (child.name === 'Flower2') {
            this.ninth = GSAP.to(child.scale, {
              x: 1,
              y: 1,
              z: 1,
              ease: 'back.out(2)',
              duration: 0.3,
            });
          }
        });

        this.secondPartTimeline.add(this.first);
        this.secondPartTimeline.add(this.second);
        this.secondPartTimeline.add(this.third);
        this.secondPartTimeline.add(this.fourth);
        this.secondPartTimeline.add(this.fifth);
        this.secondPartTimeline.add(this.sixth);
        this.secondPartTimeline.add(this.seventh);
        this.secondPartTimeline.add(this.eighth);
        this.secondPartTimeline.add(this.ninth);
      },
    });
  }

  resize() {}

  update() {}
}
