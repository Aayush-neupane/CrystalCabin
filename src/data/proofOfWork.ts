import beforeImg from '../assets/before.png';
import afterImg from '../assets/after.png';
import processVideo from '../assets/process.mp4';

export interface ProofComparison {
  id: string;
  before: string;
  after: string;
  caption: string;
}

export interface ProofVideo {
  id: string;
  src: string;
  poster?: string;
  title: string;
  description: string;
}

export const proofComparisons: ProofComparison[] = [
  {
    id: 'interior-1',
    before: beforeImg,
    after: afterImg,
    caption: 'Interior Deep Clean',
  },
];

export const proofVideos: ProofVideo[] = [
  {
    id: 'process-1',
    src: processVideo,
    title: 'The Cleaning Process — Full Detail',
    description: 'Watch a complete mobile detail, start to finish.',
  },
];
