import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlackButton from "../../../components/Buttons/BlackButton/BlackButton";
import InputField from "../../../components/Inputs/InputField/InputField";
import FileInputField from "../../../components/Inputs/FileInputField/FileInputField";
import SimpleDropdown from "../../../components/Dropdowns/SimpleDropdown/SimpleDropdown";
import { ErrorMessage, Title } from "../../Login/LoginPage.styles";
import { UserService } from "../../../services/user.service";
import { convertFileToBase64 } from "../../../utils/imageUtils";
import { AddEllementContainer, AddEllementForm } from "../../../components/Containers/AddElementContainer.styles";


const AddUserPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const userService = new UserService();
    
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        selectedRole: ''
    });
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (file: File | null) => {
        setSelectedFile(file);
    };

    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        if (error) setError('');
    };

    const handleRoleChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            selectedRole: value
        }));
    };
    const validateForm = (): boolean => {
        if (!formData.username.trim()) {
            setError('Username is required');
            return false;
        }
        if (formData.username.length < 3) {
            setError('Username must be at least 3 characters long');
            return false;
        }
        if (!formData.firstName.trim()) {
            setError('First Name is required');
            return false;
        }
        if (!formData.lastName.trim()) {
            setError('Last Name is required');
            return false;
        }
        
        if (!formData.email.trim()) {
            setError('Email is required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        
        if (!formData.selectedRole) {
            setError('Role is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            setError('');

            let base64Image = '';

            if (selectedFile) {
                try {
                    base64Image = await convertFileToBase64(selectedFile);
                    console.log('Image converted to base64, size:', base64Image.length);
                } catch (error) {
                    console.error('Error converting image to base64:', error);
                    setError('Failed to process image. Please try again.');
                    return;
                }
            }

            const userData = {
                username: formData.username.trim(),
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                role: formData.selectedRole,
                imagePath: base64Image
            };

             await userService.registerNewUser(userData);

            navigate('/users');
            
        } catch (err: any) {
            console.error('Error creating user:', err);
            
            if (err.message?.includes('username') || err.message?.includes('unique')) {
                setError('Username already exists. Please choose a different username.');
            } else {
                setError(err.message || 'Failed to create user. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const roleOptions = [
        { value: 'Admin', label: 'Administrator' },
        { value: 'User', label: 'User' }
    ];

    return (
        
                <AddEllementContainer>
                    <AddEllementForm>
                        <Title>Add New User</Title>
                        
                        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

                        <InputField
                            label="Username *"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange('username')}
                            disabled={loading}
                        />

                        <InputField
                            label="First Name *"
                            type="text"
                            value={formData.firstName}
                            onChange={handleInputChange('firstName')}
                            disabled={loading}
                        />

                        <InputField
                            label="Last Name *"
                            type="text"
                            value={formData.lastName}
                            onChange={handleInputChange('lastName')}
                            disabled={loading}
                        />

                        <InputField
                            label="Email *"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange('email')}
                            disabled={loading}
                        />

                        <SimpleDropdown
                            label="Select Role *"
                            options={roleOptions}
                            value={formData.selectedRole}
                            onChange={handleRoleChange}
                            disabled={loading}
                            placeholder=""
                        />
                        
                        <FileInputField
                            label=""
                            accept="image/*"
                            onChange={handleFileChange}
                            selectedFile={selectedFile}
                            disabled={loading}
                        />

                        <BlackButton
                            title={loading ? 'Creating User...' : 'Add User'}
                            onClick={handleSubmit}
                            disabled={loading}
                        />
                    </AddEllementForm>
                </AddEllementContainer>
        
    );
};

export default AddUserPage;