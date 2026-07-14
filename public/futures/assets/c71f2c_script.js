gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(Observer);

const root = document.documentElement;

//Stagger Variables
const textStaggerSlow = getComputedStyle(root)
  .getPropertyValue("--_gsap-variables---stagger-speed--text-stagger-slow")
  .trim();
const textStaggerMid = getComputedStyle(root)
  .getPropertyValue("--_gsap-variables---stagger-speed--text-stagger-mid")
  .trim();
const textStaggerFast = getComputedStyle(root)
  .getPropertyValue("--_gsap-variables---stagger-speed--text-stagger-fast")
  .trim();

const divStaggerSlow = getComputedStyle(root)
  .getPropertyValue("--_gsap-variables---stagger-speed--div-stagger-slow")
  .trim();
const divStaggerMid = getComputedStyle(root)
  .getPropertyValue("--_gsap-variables---stagger-speed--div-stagger-mid")
  .trim();
const divStaggerFast = getComputedStyle(root)
  .getPropertyValue("--_gsap-variables---stagger-speed--div-stagger-fast")
  .trim();

const textHighlight = getComputedStyle(root)
  .getPropertyValue("--_gsap-variables---stagger-speed--text-highlight")
  .trim();

const textYStartPosition = getComputedStyle(root)
  .getPropertyValue(
    "--_gsap-variables---stagger-start-settings--text-y-position"
  )
  .trim();
const textBlurStart = getComputedStyle(root)
  .getPropertyValue(
    "--_gsap-variables---stagger-start-settings--text-blur-amount"
  )
  .trim();
const textOpacityStart = getComputedStyle(root)
  .getPropertyValue("--_gsap-variables---stagger-start-settings--text-opacity")
  .trim();
const divYStartPosition = getComputedStyle(root)
  .getPropertyValue(
    "--_gsap-variables---stagger-start-settings--div-y-position"
  )
  .trim();
const divBlurStart = getComputedStyle(root)
  .getPropertyValue(
    "--_gsap-variables---stagger-start-settings--div-blur-amount"
  )
  .trim();
const divOpacityStart = getComputedStyle(root)
  .getPropertyValue("--_gsap-variables---stagger-start-settings--div-opacity")
  .trim();

const staggerStartFromTop = getComputedStyle(root)
  .getPropertyValue("--_gsap-variables---offset-trigger--start-from-top")
  .trim();

//Hero Variables
let heroCanvasSensitivity = getComputedStyle(root)
  .getPropertyValue(
    "--_gsap-hero-variables---infinite-canvas--canvas-sensitivity"
  )
  .trim();
const heroImageScale = getComputedStyle(root)
  .getPropertyValue("--_gsap-hero-variables---infinite-canvas--image-scale")
  .trim();
let heroImageScaleSpeed = getComputedStyle(root)
  .getPropertyValue(
    "--_gsap-hero-variables---infinite-canvas--image-scale-speed"
  )
  .trim();
const heroImageOffset = getComputedStyle(root)
  .getPropertyValue("--_gsap-hero-variables---infinite-canvas--image-offset")
  .trim();
let heroTitleMouseSensitivity = getComputedStyle(root)
  .getPropertyValue(
    "--_gsap-hero-variables---infinite-canvas--title-mouse-sensitivity"
  )
  .trim();
let heroImageMouseSensitivity = getComputedStyle(root)
  .getPropertyValue(
    "--_gsap-hero-variables---infinite-canvas--image-mouse-sensitivity"
  )
  .trim();

function limitAmount(amount) {
  amount = parseFloat(amount);
  if (amount > 1) {
    return 1;
  } else if (amount === 0) {
    return 0.001;
  } else {
    return amount;
  }
}

heroCanvasSensitivity = limitAmount(heroCanvasSensitivity);
heroImageScaleSpeed = limitAmount(heroImageScaleSpeed);
heroTitleMouseSensitivity = limitAmount(heroTitleMouseSensitivity);
heroImageMouseSensitivity = limitAmount(heroImageMouseSensitivity);

const heroTitleStaggerLoopSpeed = getComputedStyle(root)
  .getPropertyValue("--_gsap-hero-variables---title-stagger-loop--speed")
  .trim();
const heroTitleStaggerLoopDelay = getComputedStyle(root)
  .getPropertyValue("--_gsap-hero-variables---title-stagger-loop--delay")
  .trim();

//Work Variables
const workScrollSensitivity = getComputedStyle(root)
  .getPropertyValue(
    "--_gsap-works-variables---parallax-slider--scroll-sensitivity"
  )
  .trim();
const workMaxScrollSpeed = getComputedStyle(root)
  .getPropertyValue(
    "--_gsap-works-variables---parallax-slider--max-scroll-speed"
  )
  .trim();
const workScrollDuration = getComputedStyle(root)
  .getPropertyValue(
    "--_gsap-works-variables---parallax-slider--scroll-duration"
  )
  .trim();
const workAutoScrollSpeed = getComputedStyle(root)
  .getPropertyValue(
    "--_gsap-works-variables---parallax-slider--auto-scroll-speed"
  )
  .trim();
let workParallaxAmount = getComputedStyle(root)
  .getPropertyValue(
    "--_gsap-works-variables---parallax-slider--parallax-amount"
  )
  .trim();

workParallaxAmount = workParallaxAmount / 4;

if (workParallaxAmount > 0.25) {
  workParallaxAmount = 0.25;
}

//Studio Variables
const studioHexagonDuration = getComputedStyle(root)
  .getPropertyValue("--_gsap-studio-variables---hexagon--duration")
  .trim();
const studioTextYPosition = getComputedStyle(root)
  .getPropertyValue("--_gsap-studio-variables---scroll-text--text-y-position")
  .trim();
const studioRandom = getComputedStyle(root)
  .getPropertyValue("--_gsap-studio-variables---scroll-text--random")
  .trim();

//ON or OFF Variables
const onOrOffTextStaggers = getComputedStyle(root)
  .getPropertyValue("--_gsap-on-or-off-variables---text-staggers")
  .trim();
const onOrOffTextScroll = getComputedStyle(root)
  .getPropertyValue("--_gsap-on-or-off-variables---text-scroll")
  .trim();
const onOrOffTextHighlight = getComputedStyle(root)
  .getPropertyValue("--_gsap-on-or-off-variables---text-highlight")
  .trim();
const onOrOffDivStaggers = getComputedStyle(root)
  .getPropertyValue("--_gsap-on-or-off-variables---div-staggers")
  .trim();

const onOrOffHeroInfiniteCanvas = getComputedStyle(root)
  .getPropertyValue("--_gsap-on-or-off-variables---hero-infinite-canvas")
  .trim();
const onOrOffHeroTitleLoop = getComputedStyle(root)
  .getPropertyValue("--_gsap-on-or-off-variables---hero-title-loop")
  .trim();
const onOrOffWorksParallaxSlider = getComputedStyle(root)
  .getPropertyValue("--_gsap-on-or-off-variables---works-parallax-slider")
  .trim();
const onOrOffStudioHexagon = getComputedStyle(root)
  .getPropertyValue("--_gsap-on-or-off-variables---studio-hexagon")
  .trim();
const onOrOffStudioScrollText = getComputedStyle(root)
  .getPropertyValue("--_gsap-on-or-off-variables---studio-scroll-text")
  .trim();

function scrollText() {
  const text = document.querySelector("[data-scroll-text]");

  const split = new SplitText("[data-scroll-text]", {
    type: "chars",
    charsClass: "char",
  });
  const chars = split.chars;
  const deltaP = 0.05;

  let random = 0.5;

  if (parseInt(studioRandom) === 0) {
    random = 1;
  }

  const initials = chars.map(() =>
    Math.random() < random
      ? parseInt(studioTextYPosition)
      : -parseInt(studioTextYPosition)
  );

  gsap.set(chars, {
    y: (i) => initials[i],
    opacity: 0,
  });

  const horizontalTween = gsap.fromTo(
    text,
    { x: () => window.innerWidth },
    {
      x: () => -(text.offsetWidth + 20),
      ease: "linear",
      scrollTrigger: {
        trigger: "[data-scroll-wrapper]",
        start: "top -100%",
        end: "bottom 110%",
        scrub: true,
      },
    }
  );

  ScrollTrigger.create({
    trigger: "[data-scroll-wrapper]",
    start: "top -100%",
    end: "bottom 110%",
    onUpdate: (self) => {
      const p = self.progress;
      const textWidth = text.offsetWidth;
      const moveDistance = window.innerWidth + textWidth + 20;
      chars.forEach((char, i) => {
        const d = char.offsetLeft;
        const pEnter = d / moveDistance;
        const localP = gsap.utils.clamp(0, 1, (p - pEnter) / deltaP);
        gsap.set(char, {
          y: initials[i] * (1 - localP),
          opacity: localP,
        });
      });
    },
  });

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      horizontalTween.invalidate();
      ScrollTrigger.refresh();
    }, 250);
  });
}

function hexagon() {
  //Hexagon
  let autoRotate = gsap.to("[data-hexagon]", {
    rotationY: "+=360",
    duration: parseInt(studioHexagonDuration),
    repeat: -1,
    ease: "none",
  });

  let rotationY = 0;
  Observer.create({
    target: "[data-hexagon]",
    type: "pointer",
    preventDefault: true,
    onPress: function () {
      autoRotate.pause();
      rotationY = gsap.getProperty("[data-hexagon]", "rotationY");
    },
    onDrag: function (self) {
      rotationY += self.deltaX * 0.1;
      gsap.set("[data-hexagon]", { rotationY: rotationY });
    },
    onRelease: function () {
      autoRotate.invalidate().restart();
    },
  });

  document.querySelectorAll("[data-hexagon] img").forEach((img) => {
    img.addEventListener("dragstart", (e) => {
      e.preventDefault();
    });
  });
}

class ParallaxSlider {
  constructor() {
    this.config = {
      COPIES: 3,
      BUFFER: 240,
      SCROLL_SENSITIVITY: parseFloat(workScrollSensitivity),
      MAX_SCROLL_SPEED: parseFloat(workMaxScrollSpeed),
      DRAG_THRESHOLD: 5,
      CLICK_THRESHOLD: 10,
      SCROLL_DURATION: parseFloat(workScrollDuration),
      ANIMATION_EASE: "power4",
      IDLE_TIME: 100,
      AUTO_SCROLL_SPEED: parseFloat(workAutoScrollSpeed),
    };
    this.state = {
      totalSlideCount: 0,
      slideWidth: 0,
      parallaxFactor: 0,
      slides: [],
      isDragging: false,
      dragDistance: 0,
      hasActuallyDragged: false,
      sequenceWidth: 0,
      wrapX: null,
      xTo: null,
      incrX: 0,
      track: null,
      lastInteractionTime: Date.now(),
    };
    this.slider = document.querySelector("[data-slider]");
    this.state.track = document.querySelector("[data-slide-track]");
    this.calculateParallaxFactor = this.calculateParallaxFactor.bind(this);
    this.initializeSlides = this.initializeSlides.bind(this);
    this.updateParallax = this.updateParallax.bind(this);
    this.getSequenceWidth = this.getSequenceWidth.bind(this);
    this.setupTrackAnimation = this.setupTrackAnimation.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.initialize();
  }
  calculateParallaxFactor() {
    const vw = window.innerWidth;
    const w = this.state.slideWidth;
    const maxDistance = vw / 2 + this.config.BUFFER + w / 2;
    const targetBuffer = parseFloat(workParallaxAmount);
    const targetMaxOffset = targetBuffer * w;
    this.state.parallaxFactor = targetMaxOffset / maxDistance;
  }
  initializeSlides() {
    this.state.totalSlideCount =
      this.state.track.querySelectorAll("[data-slide-image]").length;

    const existingClones = this.state.track.querySelectorAll(
      '[aria-hidden="true"]'
    );
    existingClones.forEach((clone) => clone.remove());
    const originalSlides = Array.from(this.state.track.children);
    for (let i = 1; i < this.config.COPIES; i++) {
      originalSlides.forEach((slide) => {
        const clone = slide.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        this.state.track.appendChild(clone);
      });
    }
    this.state.slides = Array.from(this.state.track.children);
    this.state.slides.forEach((slide) => {
      slide.addEventListener("click", (e) => {
        e.preventDefault();
        if (
          this.state.dragDistance < this.config.CLICK_THRESHOLD &&
          !this.state.hasActuallyDragged
        ) {
          window.location.href = slide.querySelector("a").href;
        }
      });
    });
    this.state.slideWidth = this.state.slides[0].offsetWidth;
    this.calculateParallaxFactor();
  }
  updateParallax() {
    const viewportCenter = window.innerWidth / 2;
    this.state.slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (!img) return;
      const slideRect = slide.getBoundingClientRect();
      if (
        slideRect.right < -this.config.BUFFER ||
        slideRect.left > window.innerWidth + this.config.BUFFER
      ) {
        return;
      }
      const slideCenter = slideRect.left + slideRect.width / 2;
      const distanceFromCenter = slideCenter - viewportCenter;
      const parallaxOffset = distanceFromCenter * -this.state.parallaxFactor;
      img.style.transform = `translateX(${parallaxOffset}px)`;
    });
  }
  getSequenceWidth() {
    return this.state.slideWidth * this.state.totalSlideCount;
  }
  setupTrackAnimation() {
    this.state.wrapX = gsap.utils.wrap(-this.state.sequenceWidth * 2, 0);
    return gsap.quickTo(this.state.track, "x", {
      duration: this.config.SCROLL_DURATION,
      ease: this.config.ANIMATION_EASE,
      modifiers: {
        x: gsap.utils.unitize(this.state.wrapX),
      },
    });
  }
  handleResize() {
    const oldWidth = this.state.slideWidth;
    this.state.slideWidth = this.state.slides[0].offsetWidth;
    this.calculateParallaxFactor();
    if (oldWidth > 0 && this.state.slideWidth !== oldWidth) {
      const ratio = this.state.slideWidth / oldWidth;
      this.state.incrX *= ratio;
      this.state.sequenceWidth = this.getSequenceWidth();
      this.state.xTo = this.setupTrackAnimation();
      this.state.xTo(this.state.incrX);
    }
  }
  initialize() {
    this.initializeSlides();
    this.state.sequenceWidth = this.getSequenceWidth();
    gsap.set(this.state.track, {
      x: -this.state.sequenceWidth,
    });
    this.state.xTo = this.setupTrackAnimation();
    this.state.incrX = -this.state.sequenceWidth;
    this.inputObserver = Observer.create({
      target: this.slider,
      type: "wheel,touch,pointer",
      onWheel: (self) => self.event.preventDefault(),
      onDrag: (self) => self.event.preventDefault(),
      onChangeX: (self) => {
        if (self.event.type === "wheel") return;
        const mult = self.isTouch ? 1.5 : 2;
        const delta = self.deltaX * mult;
        this.state.incrX += delta;
        this.state.dragDistance += Math.abs(delta);
        if (this.state.dragDistance > this.config.DRAG_THRESHOLD)
          this.state.hasActuallyDragged = true;
        this.state.xTo(this.state.incrX);
        this.state.lastInteractionTime = Date.now();
      },
      onChangeY: (self) => {
        if (self.event.type !== "wheel") return;
        let delta = self.deltaY * this.config.SCROLL_SENSITIVITY;
        delta = Math.max(
          Math.min(delta, this.config.MAX_SCROLL_SPEED),
          -this.config.MAX_SCROLL_SPEED
        );
        this.state.incrX -= delta;
        this.state.xTo(this.state.incrX);
        this.state.lastInteractionTime = Date.now();
      },
      onPress: () => {
        this.state.isDragging = true;
        this.state.dragDistance = 0;
        this.state.hasActuallyDragged = false;
        this.state.lastInteractionTime = Date.now();
      },
      onRelease: () => {
        this.state.isDragging = false;
        setTimeout(() => {
          this.state.hasActuallyDragged = false;
        }, 100);
        this.state.lastInteractionTime = Date.now();
      },
    });
    this.slider.addEventListener("dragstart", (e) => e.preventDefault());
    window.addEventListener("resize", this.handleResize);
    this.render = () => {
      if (
        !this.state.isDragging &&
        Date.now() - this.state.lastInteractionTime > this.config.IDLE_TIME
      ) {
        this.state.incrX -= this.config.AUTO_SCROLL_SPEED;
        this.state.xTo(this.state.incrX);
      }
      this.updateParallax();
    };
    gsap.ticker.add(this.render);
  }
  destroy() {
    if (this.inputObserver) this.inputObserver.kill();
    this.slider.removeEventListener("dragstart", (e) => e.preventDefault());
    window.removeEventListener("resize", this.handleResize);
    if (this.render) gsap.ticker.remove(this.render);

    gsap.killTweensOf(this.state.track);
    this.state.slides.forEach((slide) => {
      gsap.killTweensOf(slide);
      const img = slide.querySelector("img");
      if (img) gsap.killTweensOf(img);
    });

    const existingClones = this.state.track.querySelectorAll(
      '[aria-hidden="true"]'
    );
    existingClones.forEach((clone) => clone.remove());

    this.state.slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (img) {
        img.removeAttribute("style");
      }
      slide.removeEventListener("click", () => {});
      slide.removeAttribute("style");
    });

    this.state.track.removeAttribute("style");
    gsap.set(this.state.track, { clearProps: "all" });

    this.state.slides = [];
    this.state.sequenceWidth = 0;
    this.state.incrX = 0;
    this.state.xTo = null;
    this.state.wrapX = null;

    void this.state.track.offsetHeight;
  }
}

class InfiniteCanvas {
  constructor({ el }) {
    this.$container = el;
    this.DRAG_THRESHOLD = 5;
    this.CLICK_THRESHOLD = 10;
    this.scroll = {
      ease: parseFloat(heroCanvasSensitivity),
      current: {
        x: 0,
        y: 0,
      },
      target: {
        x: 0,
        y: 0,
      },
      last: {
        x: 0,
        y: 0,
      },
      delta: {
        x: {
          c: 0,
          t: 0,
        },
        y: {
          c: 0,
          t: 0,
        },
      },
    };
    this.drag = {
      startX: 0,
      startY: 0,
      scrollX: 0,
      scrollY: 0,
    };
    this.dragDistance = 0;
    this.hasActuallyDragged = false;
    this.mouse = {
      x: {
        t: 0.5,
        c: 0.5,
      },
      y: {
        t: 0.5,
        c: 0.5,
      },
    };
    this.items = [];
    this.onResize = this.onResize.bind(this);
    this.render = this.render.bind(this);
    this.dragstartHandler = (e) => e.preventDefault();
    window.addEventListener("resize", this.onResize);
    this.inputObserver = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      onWheel: (self) => {
        self.event.preventDefault();
        const factor = 0.4;
        this.scroll.target.x -= self.deltaX * factor;
        this.scroll.target.y -= self.deltaY * factor;
      },
      onMove: (self) => {
        this.mouse.x.t = self.x / this.winW;
        this.mouse.y.t = self.y / this.winH;
      },
      onPress: (self) => {
        this.dragDistance = 0;
        this.hasActuallyDragged = false;
        this.drag.startX = self.startX;
        this.drag.startY = self.startY;
        this.drag.scrollX = this.scroll.target.x;
        this.drag.scrollY = this.scroll.target.y;
      },
      onRelease: () => {
        setTimeout(() => {
          this.hasActuallyDragged = false;
        }, 100);
      },
      onChange: (self) => {
        if (self.isPressed) {
          this.dragDistance += Math.abs(self.deltaX) + Math.abs(self.deltaY);
          if (this.dragDistance > this.DRAG_THRESHOLD)
            this.hasActuallyDragged = true;
        }
      },
      onDrag: (self) => {
        self.event.preventDefault();
        const dx = self.x - this.drag.startX;
        const dy = self.y - this.drag.startY;
        this.scroll.target.x = this.drag.scrollX + dx;
        this.scroll.target.y = this.drag.scrollY + dy;
      },
    });
    document.addEventListener("dragstart", this.dragstartHandler);
    this.onResize();
    gsap.ticker.add(this.render);
  }
  onResize() {
    this.winW = window.innerWidth;
    this.winH = window.innerHeight;
    this.scroll.current = {
      x: 0,
      y: 0,
    };
    this.scroll.target = {
      x: 0,
      y: 0,
    };
    this.scroll.last = {
      x: 0,
      y: 0,
    };

    const existingClones = this.$container.querySelectorAll(
      "[data-hero-wrapper][aria-hidden]"
    );
    existingClones.forEach((clone) => clone.remove());

    const existingMedias =
      this.$container.querySelectorAll("[data-hero-image]");
    existingMedias.forEach((el) => el.removeAttribute("style"));

    void this.$container.offsetHeight;

    const baseContent = this.$container.querySelector("[data-hero-wrapper]");
    const baseRect = baseContent.getBoundingClientRect();

    for (let i = 0; i < 3; i++) {
      const clone = baseContent.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      this.$container.appendChild(clone);
    }

    void this.$container.offsetHeight;

    this.tileSize = {
      w: baseRect.width * 2,
      h: baseRect.height * 2,
    };
    this.items = [];
    const containerRect = this.$container.getBoundingClientRect();
    const medias = this.$container.querySelectorAll("[data-hero-image]");
    medias.forEach((media) => {
      const el = media;
      const img = el.querySelector("img");
      const rect = el.getBoundingClientRect();
      const x = rect.left - containerRect.left;
      const y = rect.top - containerRect.top;
      const item = {
        el,
        img,
        x,
        y,
        w: rect.width,
        h: rect.height,
        extraX: 0,
        extraY: 0,
        rect,
        ease: Math.random() * 0.5 + 0.5,
      };
      // item.clickHandler = (e) => {
      //   e.preventDefault();
      //   if (
      //     this.dragDistance < this.CLICK_THRESHOLD &&
      //     !this.hasActuallyDragged
      //   ) {
      //     const link = item.el.hasAttribute("href")
      //       ? item.el
      //       : item.el.querySelector("a");
      //     if (link && link.href) {
      //       window.location.href = link.href;
      //     }
      //   }
      // };
      this.items.push(item);
    });
    this.items.forEach((item) => {
      gsap.set(item.el, {
        position: "absolute",
        left: 0,
        top: 0,
      });
      item.el.addEventListener("click", item.clickHandler);
    });
  }
  render() {
    this.scroll.current.x = gsap.utils.interpolate(
      this.scroll.current.x,
      this.scroll.target.x,
      this.scroll.ease
    );
    this.scroll.current.y = gsap.utils.interpolate(
      this.scroll.current.y,
      this.scroll.target.y,
      this.scroll.ease
    );
    this.scroll.delta.x.t = this.scroll.current.x - this.scroll.last.x;
    this.scroll.delta.y.t = this.scroll.current.y - this.scroll.last.y;
    this.scroll.delta.x.c = gsap.utils.interpolate(
      this.scroll.delta.x.c,
      this.scroll.delta.x.t,
      parseFloat(heroImageScaleSpeed)
    );
    this.scroll.delta.y.c = gsap.utils.interpolate(
      this.scroll.delta.y.c,
      this.scroll.delta.y.t,
      parseFloat(heroImageScaleSpeed)
    );
    this.mouse.x.c = gsap.utils.interpolate(
      this.mouse.x.c,
      this.mouse.x.t,
      parseFloat(heroTitleMouseSensitivity)
    );
    this.mouse.y.c = gsap.utils.interpolate(
      this.mouse.y.c,
      this.mouse.y.t,
      parseFloat(heroTitleMouseSensitivity)
    );
    const dirX = this.scroll.current.x > this.scroll.last.x ? "right" : "left";
    const dirY = this.scroll.current.y > this.scroll.last.y ? "down" : "up";
    this.items.forEach((item) => {
      const newX =
        5 * this.scroll.delta.x.c * item.ease +
        (this.mouse.x.c - 0.5) *
          item.rect.width *
          parseFloat(heroImageMouseSensitivity);
      const newY =
        5 * this.scroll.delta.y.c * item.ease +
        (this.mouse.y.c - 0.5) *
          item.rect.height *
          parseFloat(heroImageMouseSensitivity);

      const scrollX = this.scroll.current.x;
      const scrollY = this.scroll.current.y;
      const posX = item.x + scrollX + item.extraX + newX;
      const posY = item.y + scrollY + item.extraY + newY;
      const beforeX = posX > this.winW;
      const afterX = posX + item.rect.width < 0;
      if (dirX === "right" && beforeX) item.extraX -= this.tileSize.w;
      if (dirX === "left" && afterX) item.extraX += this.tileSize.w;
      const beforeY = posY > this.winH;
      const afterY = posY + item.rect.height < 0;
      if (dirY === "down" && beforeY) item.extraY -= this.tileSize.h;
      if (dirY === "up" && afterY) item.extraY += this.tileSize.h;
      const fx = item.x + scrollX + item.extraX + newX;
      const fy = item.y + scrollY + item.extraY + newY;
      gsap.set(item.el, {
        x: fx,
        y: fy,
      });
      const scrollSpeed = Math.min(
        1,
        Math.sqrt(
          Math.pow(this.scroll.delta.x.c, 2) +
            Math.pow(this.scroll.delta.y.c, 2)
        ) / 50
      );
      gsap.set(item.img, {
        scale:
          1.0 - (1.0 - parseFloat(heroImageScale)) * scrollSpeed * item.ease,
        xPercent: -this.mouse.x.c * item.ease * parseFloat(heroImageOffset),
        yPercent: -this.mouse.y.c * item.ease * parseFloat(heroImageOffset),
      });
    });
    this.scroll.last.x = this.scroll.current.x;
    this.scroll.last.y = this.scroll.current.y;
  }
  destroy() {
    window.removeEventListener("resize", this.onResize);
    this.inputObserver.kill();
    gsap.ticker.remove(this.render);
    document.removeEventListener("dragstart", this.dragstartHandler);

    gsap.killTweensOf(this.$container);
    this.items.forEach((item) => {
      gsap.killTweensOf(item.el);
      gsap.killTweensOf(item.img);
    });

    const existingClones = this.$container.querySelectorAll(
      "[data-hero-wrapper][aria-hidden]"
    );
    existingClones.forEach((clone) => clone.remove());

    this.items.forEach((item) => {
      item.el.removeEventListener("click", item.clickHandler);
      item.el.removeAttribute("style");
      if (item.img) {
        item.img.removeAttribute("style");
      }
    });

    this.items = [];

    void this.$container.offsetHeight;
  }
}

function animateStaggerLoop(selector, staggerValue) {
  gsap.utils.toArray(selector).forEach((el) => {
    gsap.set(el, {
      autoAlpha: 1,
    });

    const splitText = new SplitText(el, {
      type: "words,chars",
    });

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0,
      delay: 0,
    });

    tl.to(splitText.chars, {
      yPercent: 0,
      duration: 0,
      ease: "power2.out",
    })
      .to(splitText.chars, {
        yPercent: -100,
        delay: heroTitleStaggerLoopDelay,
        ease: "power2.out",
        stagger: {
          amount: heroTitleStaggerLoopSpeed,
        },
      })
      .to(splitText.chars, {
        yPercent: -200,
        delay: heroTitleStaggerLoopDelay,
        ease: "power2.out",
        stagger: {
          amount: heroTitleStaggerLoopSpeed,
        },
      });
  });
}

function animateStagger(selector, staggerValue) {
  gsap.utils.toArray(selector).forEach((el) => {
    gsap.set(el, {
      autoAlpha: 1,
    });

    const splitText = new SplitText(el, {
      type: "words,chars",
    });

    gsap.set(splitText.chars, {
      y: textYStartPosition,
      filter: `blur(${textBlurStart}px)`,
      opacity: textOpacityStart,
    });

    gsap.to(splitText.chars, {
      scrollTrigger: {
        trigger: el,
        start: `top ${staggerStartFromTop}%`,
        toggleActions: "play none none none",
      },
      y: 0,
      filter: "blur(0px)",
      opacity: 1,
      ease: "power2.out",
      stagger: staggerValue,
    });
  });
}

function animateStaggerCenter(selector, staggerValue) {
  gsap.utils.toArray(selector).forEach((el) => {
    gsap.set(el, {
      autoAlpha: 1,
    });

    const splitText = new SplitText(el, {
      type: "chars",
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "center center-=25%",
          scrub: true,
        },
      })
      .from(splitText.chars, {
        ease: "sine",
        yPercent: 300,
        autoAlpha: 0,
        stagger: {
          each: 0.04,
          from: "center",
        },
      });
  });
}

function animateStaggerDivs(selector, staggerValue) {
  gsap.utils.toArray(selector).forEach((el) => {
    gsap.set(el, {
      autoAlpha: 1,
    });

    const divs = el.querySelectorAll(":scope > div");

    gsap.from(divs, {
      y: divYStartPosition,
      filter: `blur(${divBlurStart}px)`,
      opacity: divOpacityStart,
      stagger: staggerValue,
      scrollTrigger: {
        trigger: el,
        start: `top ${staggerStartFromTop}%`,
        once: true,
      },
    });
  });
}

function animateHighlight(selector, stagger) {
  gsap.utils.toArray(selector).forEach((el) => {
    gsap.set(el, {
      autoAlpha: 1,
    });

    const splitText = new SplitText(el, {
      type: "words,chars",
    });

    gsap.set(splitText.chars, {
      opacity: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: `top ${staggerStartFromTop}%`,
        once: true,
      },
    });

    tl.to(
      splitText.chars,
      {
        scale: 1.4,
        color: "white",
        opacity: 1,
        duration: 0.3,
        ease: "power3.in",
        stagger: stagger,
      },
      0
    );

    tl.to(
      splitText.chars,
      {
        scale: 1,
        color: getComputedStyle(el).getPropertyValue("--text-highlight"),
        duration: 0.4,
        ease: "sine",
        stagger: stagger,
      },
      0.3
    );
  });
}

function isDesktop() {
  return !("ontouchstart" in window || navigator.maxTouchPoints > 0);
}

document.addEventListener("DOMContentLoaded", () => {
  if (onOrOffWorksParallaxSlider == "1") {
    if (gsap.utils.toArray("[data-slider]").length > 0) {
      let sliderInstance = null;

      function handleSlider() {
        const isDesktopView = window.innerWidth > 991 && isDesktop();

        if (isDesktopView && !sliderInstance) {
          sliderInstance = new ParallaxSlider();
        } else if (!isDesktopView && sliderInstance) {
          sliderInstance.destroy();
          sliderInstance = null;
        }
      }

      handleSlider();

      window.addEventListener("resize", handleSlider);
    }
  }

  if (onOrOffHeroInfiniteCanvas == "1") {
    if (gsap.utils.toArray("[data-hero-container]").length > 0) {
      let canvas = null;
      const heroContainer = document.querySelector("[data-hero-container]");

      function handleCanvas() {
        const isDesktopView = window.innerWidth > 991 && isDesktop();

        if (isDesktopView && !canvas) {
          document.documentElement.style.overscrollBehaviorX = "contain";
          document.body.style.overscrollBehaviorX = "contain";
          canvas = new InfiniteCanvas({ el: heroContainer });
        } else if (!isDesktopView && canvas) {
          canvas.destroy();
          canvas = null;
          document.documentElement.style.overscrollBehaviorX = "";
          document.body.style.overscrollBehaviorX = "";
        }
      }

      handleCanvas();

      window.addEventListener("resize", handleCanvas);
    }
  }

  document.fonts.ready.then(() => {
    if (onOrOffStudioScrollText == "1") {
      if (gsap.utils.toArray("[data-scroll-wrapper]").length > 0) {
        scrollText();
      }
    }

    if (onOrOffStudioHexagon == "1") {
      if (gsap.utils.toArray("[data-hexagon]").length > 0) {
        hexagon();
      }
    }

    if (onOrOffHeroTitleLoop == "1") {
      if (gsap.utils.toArray("[data-gsap-stagger-loop]").length > 0) {
        animateStaggerLoop("[data-gsap-stagger-loop]", 0.2);
      }
    }

    if (onOrOffTextStaggers == "1") {
      if (gsap.utils.toArray("[data-gsap-stagger-slow]").length > 0) {
        animateStagger("[data-gsap-stagger-slow]", textStaggerSlow);
      }
      if (gsap.utils.toArray("[data-gsap-stagger-mid]").length > 0) {
        animateStagger("[data-gsap-stagger-mid]", textStaggerMid);
      }
      if (gsap.utils.toArray("[data-gsap-stagger-fast]").length > 0) {
        animateStagger("[data-gsap-stagger-fast]", textStaggerFast);
      }
    }
    if (onOrOffTextScroll == "1") {
      if (
        gsap.utils.toArray("[data-gsap-stagger-center-on-scroll]").length > 0
      ) {
        animateStaggerCenter(
          "[data-gsap-stagger-center-on-scroll]",
          textStaggerMid
        );
      }
    }
    if (onOrOffDivStaggers == "1") {
      if (gsap.utils.toArray("[data-gsap-stagger-divs-slow]").length > 0) {
        animateStaggerDivs("[data-gsap-stagger-divs-slow]", divStaggerSlow);
      }
      if (gsap.utils.toArray("[data-gsap-stagger-divs-mid]").length > 0) {
        animateStaggerDivs("[data-gsap-stagger-divs-mid]", divStaggerMid);
      }
      if (gsap.utils.toArray("[data-gsap-stagger-divs-fast]").length > 0) {
        animateStaggerDivs("[data-gsap-stagger-divs-fast]", divStaggerFast);
      }
    }
    if (onOrOffTextHighlight == "1") {
      if (gsap.utils.toArray("[data-gsap-text-highlight]").length > 0) {
        animateHighlight("[data-gsap-text-highlight]", textHighlight);
      }
    }

    if (gsap.utils.toArray("[data-no-lenis]").length < 1) {
      // Initialize Lenis smooth scroll
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
      });

      // Connect Lenis to GSAP ScrollTrigger
      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }
  });
});
