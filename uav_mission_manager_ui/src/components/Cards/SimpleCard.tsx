import { Trash2 } from "lucide-react";
import { CardContainer, ContentSection, Description, DeleteButton, Section, SectionImage, Subsection } from "./SimpleCard.styles";
import type { SimpleCardProps } from "./SimpleCard.types";

const SimpleCard = (props: SimpleCardProps) => {
    return (
        <CardContainer>
            {props.showDelete && props.onDelete && (
                <DeleteButton onClick={props.onDelete}>
                    <Trash2 size={18} />
                </DeleteButton>
            )}
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