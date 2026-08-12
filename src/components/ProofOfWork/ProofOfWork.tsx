import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronsLeftRight, Film } from 'lucide-react';
import { proofComparisons, proofVideos } from '../../data/proofOfWork';
import './ProofOfWork.css';

function BeforeAfterSlider({ before, after, caption }: { before: string; after: string; caption: string }) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      setPosition(prev => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setPosition(prev => Math.min(100, prev + 5));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="ba-card"
    >
      <div
        className="ba-slider"
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-label={`${caption} — drag to compare before and after`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
      >
        <img className="ba-img ba-after" src={after} alt={`${caption} — after`} draggable={false} />
        <div className="ba-before-wrap" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
          <img className="ba-img ba-before" src={before} alt={`${caption} — before`} draggable={false} />
        </div>

        <span className="ba-label ba-label-before">BEFORE</span>
        <span className="ba-label ba-label-after">AFTER</span>

        <div className="ba-handle" style={{ left: `${position}%` }}>
          <ChevronsLeftRight size={20} strokeWidth={2} aria-hidden="true" />
        </div>
      </div>
      <p className="ba-caption">{caption}</p>
    </motion.div>
  );
}

function ProofVideo({ src, title, description }: { src: string; title: string; description: string }) {
  const [failed, setFailed] = useState(false);
  const [videoRatio, setVideoRatio] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6 }}
      className="proof-video"
    >
      {failed ? (
        <div className="video-fallback">
          <Film size={40} strokeWidth={1.5} aria-hidden="true" />
          <p className="video-fallback-title">{title}</p>
          <p className="video-fallback-text">Video coming soon — check back shortly.</p>
        </div>
      ) : (
        <video
          className="video-player"
          src={src}
          controls
          preload="metadata"
          playsInline
          style={videoRatio ? { aspectRatio: videoRatio } : undefined}
          onLoadedMetadata={(e) => {
            const v = e.currentTarget;
            if (v.videoWidth && v.videoHeight) {
              setVideoRatio(`${v.videoWidth} / ${v.videoHeight}`);
            }
          }}
          onError={() => setFailed(true)}
        >
          Your browser does not support the video tag.
        </video>
      )}
      <p className="video-title">{title}</p>
      <p className="video-description">{description}</p>
    </motion.div>
  );
}

export function ProofOfWork() {
  return (
    <section className="proof-of-work" id="proof-of-work" aria-labelledby="proof-heading">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="section-header"
        >
          <span className="section-label">PROOF OF WORK</span>
          <h2 id="proof-heading" className="section-title">Results You Can See</h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="intro-text"
        >
          Drag the slider to compare before and after — then watch the process in action.
        </motion.p>

        <div className="proof-grid" role="list">
          <div role="listitem">
            <BeforeAfterSlider
              before={proofComparisons[0].before}
              after={proofComparisons[0].after}
              caption={proofComparisons[0].caption}
            />
          </div>
          {proofVideos.length > 0 && (
            <div role="listitem">
              <ProofVideo
                src={proofVideos[0].src}
                title={proofVideos[0].title}
                description={proofVideos[0].description}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
