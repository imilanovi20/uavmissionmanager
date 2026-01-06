import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BlackButton from "../../../components/Buttons/BlackButton/BlackButton";
import InputField from "../../../components/Inputs/InputField/InputField";
import FileInputField from "../../../components/Inputs/FileInputField/FileInputField";
import PictureDropdown from "../../../components/Dropdowns/PictureDropdown/PictureDropdown";
import { ErrorMessage, Title } from "../../Login/LoginPage.styles";
import { uavService } from "../../../services/uav.service";
import { convertFileToBase64 } from "../../../utils/imageUtils";
import { useEquipment } from "../../../hooks/useEquioment";
import { AddEllementContainer, AddEllementForm } from "../../../components/Containers/AddElementContainer.styles";

const AddUAVPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        maxSpeed: '',
        flightTime: '',
        weight: '',
        selectedEquipment: [] as string[] 
    });
    
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    const { equipment, loading: equipmentLoading } = useEquipment();

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

    const handleEquipmentChange = (values: string[]) => {
        setFormData(prev => ({
            ...prev,
            selectedEquipment: values
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.type.trim()) {
            setError('Type is required');
            return false;
        }
        if (!formData.maxSpeed || parseFloat(formData.maxSpeed) <= 0) {
            setError('Max Speed must be greater than 0');
            return false;
        }
        if (!formData.flightTime) {
            setError('Flight Time is required');
            return false;
        }
        if (!formData.weight || parseFloat(formData.weight) <= 0) {
            setError('Weight must be greater than 0');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        try {
            setLoading(true);
            setError('');

            const equipmentIds = formData.selectedEquipment.map(id => parseInt(id));

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

            const uavData = {
                name: formData.name.trim(),
                type: formData.type.trim(),
                maxSpeed: parseFloat(formData.maxSpeed),
                flightTime: formData.flightTime,
                weight: parseFloat(formData.weight),
                additionalEquipmentIds: equipmentIds,
                imagePath: base64Image // Base64 string umjesto file path
            };

            const newUAV = await uavService.addUAV(uavData);
            console.log('UAV created with base64 image:', newUAV.id);

            navigate('/uavs');
            
        } catch (err: any) {
            console.error('Error creating UAV:', err);
            setError(err.message || 'Failed to create UAV. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const equipmentOptions = equipment.map(item => ({
        value: item.id.toString(), 
        label: item.name,
        imagePath: item.imagePath === "" || item.imagePath === "/" || !item.imagePath 
            ? '/equipment/default/equipment.webp' 
            : item.imagePath
    }));

    return (
        
                <AddEllementContainer>
                    <AddEllementForm>
                        <Title>Add New UAV</Title>
                        
                        {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

                        <InputField
                            label="Name *"
                            type="text"
                            value={formData.name}
                            onChange={handleInputChange('name')}
                            disabled={loading}
                        />

                        <InputField
                            label="Type *"
                            type="text"
                            value={formData.type}
                            onChange={handleInputChange('type')}
                            disabled={loading}
                        />

                        <InputField
                            label="Max Speed (km/h) *"
                            type="number"
                            value={formData.maxSpeed}
                            onChange={handleInputChange('maxSpeed')}
                            disabled={loading}
                        />

                        <InputField
                            label="Flight Time *"
                            type="text"
                            value={formData.flightTime}
                            onChange={handleInputChange('flightTime')}
                            disabled={loading}
                        />

                        <InputField
                            label="Weight (kg) *"
                            type="number"
                            value={formData.weight}
                            onChange={handleInputChange('weight')}
                            disabled={loading}
                        />

                        <PictureDropdown
                            label="Select Additional Equipment"
                            options={equipmentOptions}
                            value={formData.selectedEquipment}
                            onChange={handleEquipmentChange}
                            disabled={loading || equipmentLoading}
                        />
                        
                        <FileInputField
                            label=""
                            accept="image/*"
                            onChange={handleFileChange}
                            selectedFile={selectedFile}
                            disabled={loading}
                        />

                        <BlackButton
                            title={loading ? 'Creating UAV...' : 'Add UAV'}
                            onClick={handleSubmit}
                            disabled={loading}
                        />
                    </AddEllementForm>
                </AddEllementContainer>
        
    );
};

export default AddUAVPage;