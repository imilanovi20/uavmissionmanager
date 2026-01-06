import styled from "styled-components";

export const CardContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  max-width: 300px;

  &:hover {
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
`;

export const SectionImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

export const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.25rem;
`;

export const Section = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2e2e2e;
  margin: 0;
  line-height: 1.2;
`;

export const Subsection = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
`;

export const Description = styled.p`
  font-size: 1.1rem;
  color: #1a1a1a;
  margin: 0;
  font-weight: 300;
  margin-top: 0.5rem;
`;