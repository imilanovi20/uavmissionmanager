import BlackButton from "../../components/Buttons/BlackButton/BlackButton";
import SimpleCard from "../../components/Cards/SimpleCard";
import { Pagination } from "../../components/Pagination/Pagination";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useUsers } from "../../hooks/useUsers";
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

const UserPage = () => {
    const defaultImagePath = "/user/default/default-user.jpg";

    const {
        paginatedUsers,
        loading,
        error,
        currentPage,
        totalPages,
        setCurrentPage,
        goToNextPage,
        goToPrevPage,
        deleteUser  
    } = useUsers({ itemsPerPage: 6 });

    const { isAdmin } = useCurrentUser();
    const navigate = useNavigate();

    if (loading) {
        return (
            <PageContainer>
                <LoadingSpinner>Loading users...</LoadingSpinner>
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

    const handleAddUser = () => {
        navigate('/users/add');
    };

    const handleDeleteUser = async (username: string) => {
        if (window.confirm(`Are you sure you want to delete user ${username}?`)) {
            await deleteUser(username);
        }
    };

    return (
        <PageContainer>
            <Header>
                <HeaderTop>
                    <div>
                        <Title>Users</Title>
                        <Subtitle>System users and administrators</Subtitle>
                    </div>
                    {isAdmin && (
                        <BlackButton
                            title="+ Add User"
                            onClick={handleAddUser}
                            disabled={false}
                            width="180px"
                            height="auto"
                        />
                    )}
                </HeaderTop>
            </Header>

            <CardContainer>
                {paginatedUsers.map((user) => (
                    <SimpleCard
                        key={user.username}
                        imagePath={
                            user.imagePath === "" || user.imagePath === "/" || !user.imagePath
                                ? defaultImagePath
                                : user.imagePath
                        }
                        altImagePath={user.username}
                        sectionTitle={user.username}
                        subsectionTitle={user.role}
                        description={user.email || "No email provided"}
                        showDelete={isAdmin}  
                        onDelete={() => handleDeleteUser(user.username)}  
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

export default UserPage;