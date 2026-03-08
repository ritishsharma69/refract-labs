"use client"

import { memo, useEffect, useLayoutEffect, useState } from "react"
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from "framer-motion"
import { 
  Globe, 
  Smartphone, 
  Share2, 
  Target, 
  Users, 
  Server, 
  Megaphone,
  type LucideIcon
} from "lucide-react"

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) return defaultValue
    return window.matchMedia(query).matches
  }

  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) return getMatches(query)
    return defaultValue
  })

  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    const handleChange = () => setMatches(matchMedia.matches)
    handleChange()
    matchMedia.addEventListener("change", handleChange)
    return () => matchMedia.removeEventListener("change", handleChange)
  }, [query])

  return matches
}

interface ServiceItem {
  title: string
  icon: LucideIcon
  gradient: string
}

const services: ServiceItem[] = [
  { title: "Website Development", icon: Globe, gradient: "from-orange-500 to-amber-600" },
  { title: "App Development", icon: Smartphone, gradient: "from-orange-600 to-red-500" },
  { title: "Social Media", icon: Share2, gradient: "from-amber-500 to-orange-600" },
  { title: "AD Strategic", icon: Target, gradient: "from-red-500 to-orange-500" },
  { title: "Social Media Management", icon: Users, gradient: "from-orange-400 to-amber-500" },
  { title: "IT Services", icon: Server, gradient: "from-amber-600 to-orange-500" },
  { title: "Brand Strategy", icon: Megaphone, gradient: "from-orange-500 to-red-600" },
]

const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const }

const ServiceCard = memo(({ service, isActive }: { service: ServiceItem; isActive: boolean }) => {
  const Icon = service.icon
  return (
    <div className={`
      w-full h-full rounded-2xl p-4 flex flex-col items-center justify-center gap-3
      bg-gradient-to-br ${service.gradient} backdrop-blur-sm
      border border-white/20 shadow-xl
      transition-all duration-300
      ${isActive ? 'scale-105' : ''}
    `}>
      <div className="p-3 rounded-full bg-black/20 backdrop-blur-sm">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <p className="text-white text-sm font-semibold text-center leading-tight px-2">
        {service.title}
      </p>
    </div>
  )
})

const Carousel = memo(({
  handleClick,
  controls,
  isCarouselActive,
}: {
  handleClick: (index: number) => void
  controls: ReturnType<typeof useAnimation>
  isCarouselActive: boolean
}) => {
  const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
  const cylinderWidth = isScreenSizeSm ? 900 : 1400
  const faceCount = services.length
  const faceWidth = cylinderWidth / faceCount
  const radius = cylinderWidth / (2 * Math.PI)
  const rotation = useMotionValue(0)
  const transform = useTransform(rotation, (value) => `rotate3d(0, 1, 0, ${value}deg)`)

  // Auto-rotate effect
  useEffect(() => {
    if (!isCarouselActive) return
    const interval = setInterval(() => {
      rotation.set(rotation.get() - 0.3)
    }, 30)
    return () => clearInterval(interval)
  }, [isCarouselActive, rotation])

  return (
    <div
      className="flex h-full items-center justify-center"
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        drag={isCarouselActive ? "x" : false}
        className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
        style={{
          transform,
          rotateY: rotation,
          width: cylinderWidth,
          transformStyle: "preserve-3d",
        }}
        onDrag={(_, info) => isCarouselActive && rotation.set(rotation.get() + info.offset.x * 0.05)}
        onDragEnd={(_, info) =>
          isCarouselActive &&
          controls.start({
            rotateY: rotation.get() + info.velocity.x * 0.05,
            transition: { type: "spring", stiffness: 100, damping: 30, mass: 0.1 },
          })
        }
        animate={controls}
      >
        {services.map((service, i) => (
          <motion.div
            key={`service-${i}`}
            className="absolute flex h-full origin-center items-center justify-center p-1"
            style={{
              width: `${faceWidth}px`,
              transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
            }}
            onClick={() => handleClick(i)}
          >
            <ServiceCard service={service} isActive={false} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
})

function ThreeDServiceCarousel() {
  const [activeService, setActiveService] = useState<number | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const controls = useAnimation()

  const handleClick = (index: number) => {
    setActiveService(index)
    setIsCarouselActive(false)
    controls.stop()
  }

  const handleClose = () => {
    setActiveService(null)
    setIsCarouselActive(true)
  }

  return (
    <motion.div layout className="relative">
      <AnimatePresence mode="sync">
        {activeService !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            transition={transitionOverlay}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-72 h-72 md:w-80 md:h-80"
            >
              <ServiceCard service={services[activeService]} isActive={true} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="relative h-[350px] md:h-[400px] w-full overflow-hidden">
        <Carousel
          handleClick={handleClick}
          controls={controls}
          isCarouselActive={isCarouselActive}
        />
      </div>
    </motion.div>
  )
}

export { ThreeDServiceCarousel }

