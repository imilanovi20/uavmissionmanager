import { Component } from "lucide-react";
import BlackButton from "../../components/Buttons/BlackButton/BlackButton";
import IconButton from "../../components/Buttons/IconButton/IconButton";
import SimpleCard from "../../components/Cards/SimpleCard";
import { Pagination } from "../../components/Pagination/Pagination";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useUAV } from "../../hooks/useUAVs";
import {
    CardContainer,
    ErrorMessage,
    Header,
    HeaderTop,
    LoadingSpinner,
    PageContainer,
    Subtitle,
    Title
} from "../../components/Containers/CardContainer.styles";
import { useNavigate } from "react-router-dom";

const UAVPage = () => {
    const defaultImagePath = "/uav/default/drone.png";
    const {
        paginatedUAVs,
        loading,
        error,
        currentPage,
        totalPages,
        setCurrentPage,
        goToNextPage,
        goToPrevPage,
        deleteUAV  // dodaj ovo
    } = useUAV({ itemsPerPage: 6 });

    const { isAdmin } = useCurrentUser();
    const navigate = useNavigate();

    if (loading) {
        return (
            <PageContainer>
                <LoadingSpinner>Loading UAVs...</LoadingSpinner>
            </PageContainer>
        );
    }

    if (error) {
        return (
            <PageContainer>
                <ErrorMessage>{error}</ErrorMessage>
            </PageContainer>
        );
    }

    function handleAddUAV(): void {
        navigate('/uavs/add');
    }

    function handleAdditionaEquipment(): void {
        throw new Error("Function not implemented.");
    }

    const handleDeleteUAV = async (id: number, name: string) => {
        if (window.confirm(`Are you sure you want to delete ${name}?`)) {  
            await deleteUAV(id);
        }
    };

    return (
        <PageContainer>
            <Header>
                <HeaderTop>
                    <div>
                        <Title>UAVs</Title>
                        <Subtitle>Unmanned aerial vehicles</Subtitle>
                        <br />
                        <IconButton
                            icon={<Component />}
                            onClick={handleAdditionaEquipment}
                            size="48px"
                        />
                    </div>

                    {isAdmin && (
                        <BlackButton
                            title="+ Add UAV"
                            onClick={handleAddUAV}
                            disabled={false}
                            width="180px"
                        />
                    )}
                </HeaderTop>
            </Header>

            <CardContainer>
                {paginatedUAVs.map((uav) => (
                    <SimpleCard
                        key={uav.id}
                        imagePath={
                            uav.imagePath === "" || uav.imagePath === "/"
                                ? defaultImagePath
                                : uav.imagePath
                        }
                        altImagePath={uav.name}
                        sectionTitle={uav.name}
                        subsectionTitle={uav.type}
                        description={`${uav.maxSpeed} km/h`}  
                        showDelete={isAdmin}  // dodaj ovo
                        onDelete={() => handleDeleteUAV(uav.id, uav.name)}  
                    />
                ))}
            </CardContainer>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onPrevious={goToPrevPage}
                onNext={goToNextPage}
            />
        </PageContainer>
    );
};

export default UAVPage;