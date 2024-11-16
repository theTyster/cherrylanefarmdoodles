
// Components
import CLFImage from '@/components/CLFImage/CLFImage';

// Types
import type { StaticImageData } from 'next/image';

// Static
import css from '@styles/dog-coat-info.module.scss';
import GoldenRetrieverImage from '@pub/images/golden-retriever.jpg';

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
    imageSrc: "https://www.goldendoodleassociation.com/wp-content/uploads/2023/10/IMG_6830-768x1024.jpeg",
    genotype: 'Furnished: +/+',
    description: ['Low Allergenic Potential', 'Regular Grooming Required'],
    styleClass: css['curly'],
  },
  {
    name: 'Wavy',
    imageSrc: "https://images.squarespace-cdn.com/content/v1/5bc777e3e4afe97b84f34ca9/1613074720014-A6RJW4D0Z9X05443F02C/Teeva+8+mo.jpg", 
    genotype: 'Furnished: +/-',
    description: ['Low Allergenic Potential', 'Low Shedding'],
    styleClass: css['wavy'],
  },
  {
    name: 'Straight',
    imageSrc: "https://images.squarespace-cdn.com/content/v1/5c633e877fdcb88882c06b25/1554511781614-QXQNPDE810M9M7034A49/ke17ZwdGBToddI8pDm48kB_2DV4n7QKfClMDpW9oLsF7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0p4XabXLlNWpcJMv7FrN_NLngywcqSSw8I4Fjju04FCCY41Yvhp5yGH9w1eWsICZKA/m2.jpg",
    genotype: 'Furnished: -/-',
    description: ['Low Shedding'],
    styleClass: css['straight'],
  },
  {
    name: 'Flat',
    imageSrc: GoldenRetrieverImage,
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
