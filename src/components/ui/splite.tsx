import { Suspense, lazy } from 'react'
import useInView from '../../hooks/useInView'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

const Loader = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-[#e07030] border-t-transparent rounded-full animate-spin" />
  </div>
)

// Only mount the heavy WebGL scene while the host element is on/near viewport.
// Once user scrolls past, the component unmounts so GPU/CPU get freed up.
export function SplineScene({ scene, className }: SplineSceneProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: '400px 0px' })

  return (
    <div ref={ref} className={className} style={{ width: '100%', height: '100%' }}>
      {inView ? (
        <Suspense fallback={<Loader />}>
          <Spline scene={scene} className={className} />
        </Suspense>
      ) : (
        <Loader />
      )}
    </div>
  )
}

