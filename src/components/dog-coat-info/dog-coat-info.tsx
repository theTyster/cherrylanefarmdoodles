import CLFImage from '@/components/CLFImage/CLFImage';

import css from '@styles/dog-coat-info.module.scss';

interface CoatType {
  name: string;
  imageSrc: string;
  genotype: string;
  description: string[];
  styleClass: string;
}

const coatTypes: CoatType[] = [
  {
    name: 'Curly',
    /**@ts-expect-error  This will be changed later on implementation.*/
    imageSrc: null,
    genotype: 'Furnished: +/+',
    description: ['Low Allergenic Potential', 'Regular Grooming Required'],
    styleClass: css['curly'],
  },
  {
    name: 'Wavy',
    /**@ts-expect-error  This will be changed later on implementation.*/
    imageSrc: null, 
    genotype: 'Furnished: +/-',
    description: ['Low Allergenic Potential', 'Low Shedding'],
    styleClass: css['wavy'],
  },
  {
    name: 'Straight',
    /**@ts-expect-error  This will be changed later on implementation.*/
    imageSrc: null,
    genotype: 'Furnished: -/-',
    description: ['Low Shedding'],
    styleClass: css['straight'],
  },
  {
    name: 'Flat',
    /**@ts-expect-error  This will be changed later on implementation.*/
    imageSrc: null,
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
