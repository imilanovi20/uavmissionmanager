import { Plane, Users, MapPin, Calendar, Trash2 } from 'lucide-react';
import {
    CardWrapper,
    DeleteButton,
    WideCardContainer,
    WideCardHeader,
    WideCardTitleSection,
    WideCardTitle,
    WideCardDate,
    StatusBadge,
    WideCardDescription,
    WideCardMeta,
    MetaItem,
    MetaLabel,
    MetaValue
} from './WideCard.styles';
import type { WideCardProps } from './WideCard.types';

const WideCard = ({
    title,
    date,
    description,
    status,
    uavCount,
    teamCount,
    waypointCount,
    createdBy,
    onClick,
    onDelete,
    showDelete
}: WideCardProps) => {
    const getStatusLabel = (status: string) => {
        if (status === 'completed') return 'Completed';
        if (status === 'active') return 'Active Today';
        return 'Upcoming';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onDelete) {
            onDelete();
        }
    };

    return (
        <CardWrapper>
            {showDelete && onDelete && (
                <DeleteButton onClick={handleDelete}>
                    <Trash2 size={18} />
                </DeleteButton>
            )}
            <WideCardContainer $status={status} onClick={onClick}>
                <WideCardHeader>
                    <WideCardTitleSection>
                        <WideCardTitle>{title}</WideCardTitle>
                        <WideCardDate>{formatDate(date)}</WideCardDate>
                    </WideCardTitleSection>
                    <StatusBadge $status={status}>
                        {getStatusLabel(status)}
                    </StatusBadge>
                </WideCardHeader>

                <WideCardDescription>{description}</WideCardDescription>

                <WideCardMeta>
                    <MetaItem>
                        <Plane size={16} />
                        <MetaLabel>UAVs:</MetaLabel>
                        <MetaValue>{uavCount}</MetaValue>
                    </MetaItem>

                    <MetaItem>
                        <Users size={16} />
                        <MetaLabel>Team:</MetaLabel>
                        <MetaValue>{teamCount}</MetaValue>
                    </MetaItem>

                    <MetaItem>
                        <MapPin size={16} />
                        <MetaLabel>Waypoints:</MetaLabel>
                        <MetaValue>{waypointCount}</MetaValue>
                    </MetaItem>

                    <MetaItem>
                        <Calendar size={16} />
                        <MetaLabel>Created by:</MetaLabel>
                        <MetaValue>{createdBy}</MetaValue>
                    </MetaItem>
                </WideCardMeta>
            </WideCardContainer>
        </CardWrapper>
    );
};

export default WideCard;