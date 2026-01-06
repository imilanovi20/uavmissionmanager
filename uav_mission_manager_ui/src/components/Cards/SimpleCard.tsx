import { CardContainer, ContentSection, Description, Section, SectionImage, Subsection } from "./SimpleCard.styles";
import type { SimpleCardProps } from "./SimpleCard.types";

const SimpleCard = (props : SimpleCardProps) => {
  return (
    <CardContainer>
      <SectionImage 
        src={props.imagePath} 
        alt={props.altImagePath}
      />
      <ContentSection>
        <Section>{props.sectionTitle}</Section>
        <Subsection>{props.subsectionTitle}</Subsection>
        <Description>{props.description}</Description>
      </ContentSection>
    </CardContainer>
  );
};

export default SimpleCard;