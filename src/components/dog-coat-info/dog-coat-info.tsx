
// Components
import CLFImage from '@/components/CLFImage/CLFImage';

// Types
import type { StaticImageData } from 'next/image';

// Static
import css from '@styles/dog-coat-info.module.scss';
import Curly from '@pub/images/curly.jpg';
import Wavy from '@pub/images/wavy.jpg';
import Straight from '@pub/images/straight.jpg';
import Flat from '@pub/images/flat.jpg';

interface CoatType {
  name: string;
  imageSrc: string | StaticImageData;
  genotype: string;
  description: string[];
  styleClass: string;
}

const coatTypes: CoatType[] = [
  {
    name: 'Curly',
    imageSrc: Curly,
    genotype: 'Furnished: +/+',
    description: ['Low Allergenic Potential', 'Regular Grooming Required'],
    styleClass: css['curly'],
  },
  {
    name: 'Wavy',
    imageSrc: Wavy,
    genotype: 'Furnished: +/-',
    description: ['Low Allergenic Potential', 'Low Shedding'],
    styleClass: css['wavy'],
  },
  {
    name: 'Straight',
    imageSrc: Straight,
    genotype: 'Furnished: -/-',
    description: ['Low Shedding'],
    styleClass: css['straight'],
  },
  {
    name: 'Flat',
    imageSrc: Flat,
    genotype: 'Unfurnished',
    description: ['Allergenic', 'Moderate to High Shedding', 'Low Maintenance Coat'],
    styleClass: css['flat'],
  },
];

const DogCoatInfo: React.FC = () => {
  return (
    <div className={css["dog-coat-info"]}>
      {coatTypes.map((coat) => (
        <div key={coat.name} className={`${css["coat-type"]} ${coat.styleClass}`}>
          <h2>{coat.name}</h2>
          <CLFImage src={coat.imageSrc} alt={`${coat.name} coat`} width={300} height={400} />
          <p><strong>Genotype:</strong> {coat.genotype}</p>
          <ul>
            {coat.description.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DogCoatInfo;
