import React, { useState, useEffect } from 'react';
import { IoSearch } from "react-icons/io5";
import { IoMdAddCircleOutline, IoMdRefresh } from "react-icons/io";
import { MdEdit, MdDelete, MdAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useGetCitiesQuery, useDeleteCityMutation, useUpdateCityMutation } from '../../redux/api/cityApiSlice';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, IconButton, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import CityCard from './CityCard';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

const ManageCity = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [searched, setSearched] = useState(false);
    const [filteredResults, setFilteredResults] = useState([]);
    const { data: citiesResponse, isLoading, error, refetch } = useGetCitiesQuery();
    const [deleteCity, { isLoading: isDeleting }] = useDeleteCityMutation();
    const [updateCity, { isLoading: isUpdating }] = useUpdateCityMutation();

    // State cho dialog xác nhận xóa
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [cityToDelete, setCityToDelete] = useState(null);

    // State cho modal chỉnh sửa
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingCity, setEditingCity] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        bestTimeToVisit: '',
        popularPlaces: [],
        popularQuestions: []
    });

    // 1. Thêm state cho ảnh thành phố và ảnh địa điểm nổi bật khi chỉnh sửa
    const [editImages, setEditImages] = useState([]);
    const [editPopularPlacesImages, setEditPopularPlacesImages] = useState([]); // [{image: File|null}]

    useEffect(() => {
        if (editingCity) {
            setEditForm({
                name: editingCity.name || '',
                description: editingCity.description || '',
                bestTimeToVisit: editingCity.bestTimeToVisit || '',
                popularPlaces: editingCity.popularPlace || [],
                popularQuestions: editingCity.popularQuestion || []
            });
            setEditImages(editingCity.img || []);
            setEditPopularPlacesImages(
                (editingCity.popularPlace || []).map(place => ({ image: null, oldImg: place.img || null }))
            );
        }
    }, [editingCity]);

    // Xử lý tìm kiếm
    useEffect(() => {
        if (!search.trim() || !citiesResponse) {
            setFilteredResults([]);
            setSearched(false);
            return;
        }

        const searchTerm = search.trim().toLowerCase();
        const cities = Array.isArray(citiesResponse.data) ? citiesResponse.data : 
                      Array.isArray(citiesResponse) ? citiesResponse : [];
        
        const results = cities.filter(city => {
            const cityName = city?.name?.toLowerCase() || '';
            return cityName.includes(searchTerm);
        });

        setFilteredResults(results);
        setSearched(true);
    }, [search, citiesResponse]);

    const handleSearch = (e) => {
        e?.preventDefault();
        if (!search.trim()) {
            setSearched(false);
            setFilteredResults([]);
        } else {
            setSearched(true);
        }
    };

    // Xử lý mở modal chỉnh sửa
    const handleOpenEditModal = (city) => {
        setEditingCity(city);
        setEditModalOpen(true);
    };

    // Xử lý đóng modal chỉnh sửa
    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setEditingCity(null);
        setEditForm({
            name: '',
            description: '',
            bestTimeToVisit: '',
            popularPlaces: [],
            popularQuestions: []
        });
    };

    // Thêm handlers cho popular places
    const handleAddPopularPlace = () => {
        setEditForm({
            ...editForm,
            popularPlaces: [
                ...editForm.popularPlaces,
                { name: '', description: '' }
            ]
        });
    };

    const handleRemovePopularPlace = (index) => {
        const newPlaces = [...editForm.popularPlaces];
        newPlaces.splice(index, 1);
        setEditForm({
            ...editForm,
            popularPlaces: newPlaces
        });
    };

    const handlePopularPlaceChange = (index, field, value) => {
        const newPlaces = [...editForm.popularPlaces];
        newPlaces[index] = {
            ...newPlaces[index],
            [field]: value
        };
        setEditForm({
            ...editForm,
            popularPlaces: newPlaces
        });
    };

    // 3. Thêm handler cho upload/xóa ảnh thành phố và địa điểm nổi bật
    const handleEditImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setEditImages([...editImages, ...files]);
    };
    const handleRemoveEditImage = (index) => {
        const newImages = [...editImages];
        newImages.splice(index, 1);
        setEditImages(newImages);
    };
    const handleEditPopularPlaceImageChange = (index, file) => {
        const newPlaces = [...editPopularPlacesImages];
        newPlaces[index] = { ...newPlaces[index], image: file };
        setEditPopularPlacesImages(newPlaces);
    };
    const handleRemoveEditPopularPlaceImage = (index) => {
        const newPlaces = [...editPopularPlacesImages];
        newPlaces[index] = { ...newPlaces[index], image: null, oldImg: null };
        setEditPopularPlacesImages(newPlaces);
    };

    // Thêm handlers cho popular questions
    const handleAddPopularQuestion = () => {
        setEditForm({
            ...editForm,
            popularQuestions: [
                ...editForm.popularQuestions,
                { Question: '', answer: '' }
            ]
        });
    };
    const handleRemovePopularQuestion = (index) => {
        const newQuestions = [...editForm.popularQuestions];
        newQuestions.splice(index, 1);
        setEditForm({
            ...editForm,
            popularQuestions: newQuestions
        });
    };
    const handlePopularQuestionChange = (index, field, value) => {
        const newQuestions = [...editForm.popularQuestions];
        newQuestions[index] = {
            ...newQuestions[index],
            [field]: value
        };
        setEditForm({
            ...editForm,
            popularQuestions: newQuestions
        });
    };

    // 4. Sửa handleUpdateCity để gửi FormData nếu có ảnh mới, hoặc object thường nếu không
    const handleUpdateCity = async () => {
        try {
            if (!editForm.name.trim() || !editForm.description.trim() || !editForm.bestTimeToVisit.trim()) {
                toast.error('Vui lòng điền đầy đủ thông tin cơ bản');
                return;
            }
            // Kiểm tra thông tin của popular places
            const invalidPlaces = editForm.popularPlaces.filter(
                place => !place.name.trim() || !place.description.trim()
            );
            if (invalidPlaces.length > 0) {
                toast.error('Vui lòng điền đầy đủ thông tin cho tất cả địa điểm nổi bật');
                return;
            }
            // Kiểm tra thông tin của popular questions
            const invalidQuestions = editForm.popularQuestions.filter(
                q => !q.Question.trim() || !q.answer.trim()
            );
            if (invalidQuestions.length > 0) {
                toast.error('Vui lòng điền đầy đủ thông tin cho tất cả câu hỏi phổ biến');
                return;
            }
            // Nếu có ảnh mới, gửi FormData
            const hasNewCityImage = editImages.some(img => img instanceof File);
            const hasNewPopularPlaceImage = editPopularPlacesImages.some(p => p.image instanceof File);
            if (hasNewCityImage || hasNewPopularPlaceImage) {
                const formData = new FormData();
                formData.append('name', editForm.name.trim());
                formData.append('description', editForm.description.trim());
                formData.append('bestTimeToVisit', editForm.bestTimeToVisit.trim());
                // Ảnh thành phố
                editImages.forEach(img => {
                    if (img instanceof File) formData.append('images', img);
                    else if (typeof img === 'string') formData.append('oldImages', img); // giữ lại ảnh cũ
                });
                // Địa điểm nổi bật
                editForm.popularPlaces.forEach((place, idx) => {
                    formData.append(`popularPlaces[${idx}].name`, place.name.trim());
                    formData.append(`popularPlaces[${idx}].description`, place.description.trim());
                    // Ảnh mới
                    if (editPopularPlacesImages[idx]?.image instanceof File) {
                        formData.append(`popularPlaces[${idx}].img`, editPopularPlacesImages[idx].image);
                    } else if (editPopularPlacesImages[idx]?.oldImg) {
                        formData.append(`popularPlaces[${idx}].oldImg`, editPopularPlacesImages[idx].oldImg);
                    }
                });
                // Câu hỏi phổ biến
                editForm.popularQuestions.forEach((q, idx) => {
                    formData.append(`popularQuestion[${idx}].Question`, q.Question.trim());
                    formData.append(`popularQuestion[${idx}].answer`, q.answer.trim());
                });
                await updateCity({ id: editingCity._id, data: formData }).unwrap();
            } else {
                // Không có ảnh mới, gửi object thường
                await updateCity({
                    id: editingCity._id,
                    data: {
                        name: editForm.name.trim(),
                        description: editForm.description.trim(),
                        bestTimeToVisit: editForm.bestTimeToVisit.trim(),
                        popularPlace: editForm.popularPlaces.map(place => ({
                            name: place.name.trim(),
                            description: place.description.trim(),
                            img: place.img || null
                        })),
                        img: editImages, // giữ lại ảnh cũ
                        popularQuestion: editForm.popularQuestions.map(q => ({
                            Question: q.Question.trim(),
                            answer: q.answer.trim()
                        }))
                    }
                }).unwrap();
            }
            toast.success('Cập nhật thành phố thành công!');
            handleCloseEditModal();
            refetch();
        } catch (error) {
            console.error('Update city error:', error);
            toast.error(error.data?.message || 'Có lỗi xảy ra khi cập nhật thành phố');
        }
    };

    // Xử lý xóa thành phố
    const handleDeleteCity = async () => {
        try {
            await deleteCity(cityToDelete._id).unwrap();
            toast.success('Xóa thành phố thành công!');
            handleCloseDeleteDialog();
            refetch();
        } catch (error) {
            console.error('Delete city error:', error);
            toast.error(error.data?.message || 'Có lỗi xảy ra khi xóa thành phố');
        }
    };

    const handleOpenDeleteDialog = (city) => {
        setCityToDelete(city);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialogOpen(false);
        setCityToDelete(null);
    };

    if (isLoading) {
        return (
            <div className='bg-softBlue min-h-screen p-4 md:p-8'>
                <div className='bg-white rounded-lg shadow-md mt-4 p-4 md:p-6 flex justify-center items-center'>
                    <p className='text-gray-500'>Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='bg-softBlue min-h-screen p-4 md:p-8'>
                <div className='bg-white rounded-lg shadow-md mt-4 p-4 md:p-6'>
                    <p className='text-red-500'>Có lỗi khi tải dữ liệu: {error.message}</p>
                    <button 
                        onClick={refetch}
                        className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    const cities = Array.isArray(citiesResponse?.data) ? citiesResponse.data : 
                  Array.isArray(citiesResponse) ? citiesResponse : [];
    const validCities = cities.filter(city => city && typeof city.name === 'string');

    return (
        <div className='bg-softBlue min-h-screen p-4 md:p-8'>
            <p className='font-semibold text-[20px] md:text-[24px]'>Tất cả thành phố</p>
            <div className='bg-white rounded-lg shadow-md mt-4 p-4 md:p-6'>
                {/* Search Bar */}
                <form onSubmit={handleSearch} className='flex flex-col sm:flex-row sm:items-center gap-3'>
                    <span className='text-[16px] font-medium text-gray-500'>Tìm kiếm</span>
                    <div className='flex items-center border border-gray-300 rounded-lg p-2 focus-within:border-gray-600'>
                        <input
                            type='text'
                            placeholder='Tìm kiếm thành phố...'
                            className='text-[14px] outline-none flex-1'
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                if (!e.target.value.trim()) {
                                    setSearched(false);
                                    setFilteredResults([]);
                                }
                            }}
                        />
                        <button type="submit" className='p-1 hover:bg-gray-100 rounded-full'>
                            <IoSearch className='text-gray-500 text-[20px]' />
                        </button>
                    </div>

                    <div className='ml-auto flex items-center'>
                        <button 
                            type="button"
                            className='hover:bg-gray-100 p-2 rounded-full' 
                            onClick={() => navigate('/admin/create-city')}
                        >
                            <IoMdAddCircleOutline className='text-[28px] text-green-400' />
                        </button>
                        <button 
                            type="button"
                            className='hover:bg-gray-100 p-2 rounded-full' 
                            onClick={refetch}
                        >
                            <IoMdRefresh className='text-[28px] text-gray-400' />
                        </button>
                    </div>
                </form>

                {/* Results */}
                <div className='mt-4 p-4'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                        {(searched ? filteredResults : validCities).map((city) => (
                            <CityCard
                                key={city._id}
                                city={city}
                                onEdit={() => handleOpenEditModal(city)}
                                onDelete={() => handleOpenDeleteDialog(city)}
                                isDeleting={isDeleting && cityToDelete?._id === city._id}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Dialog xác nhận xóa */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Xác nhận xóa thành phố
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa thành phố "{cityToDelete?.name}"? 
                        Hành động này không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleCloseDeleteDialog}
                        color="primary"
                    >
                        Hủy
                    </Button>
                                <Button
                        onClick={handleDeleteCity} 
                        color="error" 
                        variant="contained"
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Đang xóa...' : 'Xóa'}
                                </Button>
                </DialogActions>
            </Dialog>

            {/* Modal chỉnh sửa */}
            <Dialog
                open={editModalOpen}
                onClose={handleCloseEditModal}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Chỉnh sửa thành phố
                </DialogTitle>
                <DialogContent>
                    <div className="space-y-4 mt-2">
                    <TextField
                        fullWidth
                            label="Tên thành phố"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            variant="outlined"
                            size="small"
                    />
                    <TextField
                        fullWidth
                        label="Mô tả"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            variant="outlined"
                        multiline
                        rows={4}
                            size="small"
                        />
                        <TextField
                            fullWidth
                            label="Thời điểm tốt nhất để ghé thăm"
                            value={editForm.bestTimeToVisit}
                            onChange={(e) => setEditForm({ ...editForm, bestTimeToVisit: e.target.value })}
                            variant="outlined"
                            multiline
                            rows={3}
                            size="small"
                        />

                        {/* UI upload/xóa ảnh thành phố */}
                        <div className="mb-4">
                            <label className="block font-medium mb-2">Hình ảnh thành phố</label>
                            <div className="flex flex-wrap gap-4 mb-3">
                                {editImages.map((img, idx) => (
                                    <div key={idx} className="relative">
                                        <img src={img instanceof File ? URL.createObjectURL(img) : img} alt={`city-edit-${idx}`} className="w-24 h-24 object-cover rounded" />
                                        <IconButton size="small" className="absolute top-1 right-1 bg-white" onClick={() => handleRemoveEditImage(idx)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </div>
                                ))}
                                <Button variant="outlined" component="label" startIcon={<AddIcon />} className="h-24 w-24">
                                    Thêm ảnh
                                    <input type="file" hidden multiple accept="image/*" onChange={handleEditImageUpload} />
                                </Button>
                            </div>
                        </div>

                        <Divider className="my-4" />

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Địa điểm nổi bật</h3>
                                <Button
                                    startIcon={<MdAdd />}
                                    onClick={handleAddPopularPlace}
                                    variant="outlined"
                                    size="small"
                                >
                                    Thêm địa điểm
                                </Button>
                            </div>

                            {editForm.popularPlaces.map((place, index) => (
                                <div key={index} className="border rounded-lg p-4 relative">
                                    <IconButton
                                        size="small"
                                        className="absolute top-2 right-2"
                                        onClick={() => handleRemovePopularPlace(index)}
                                    >
                                        <MdDelete />
                                    </IconButton>

                                    <div className="space-y-3">
                                        <TextField
                                            fullWidth
                                            label="Tên địa điểm"
                                            value={place.name}
                                            onChange={(e) => handlePopularPlaceChange(index, 'name', e.target.value)}
                                            variant="outlined"
                                            size="small"
                                        />
                                        <TextField
                                            fullWidth
                                            label="Mô tả địa điểm"
                                            value={place.description}
                                            onChange={(e) => handlePopularPlaceChange(index, 'description', e.target.value)}
                                            variant="outlined"
                                            multiline
                                            rows={2}
                                            size="small"
                                        />
                                        {/* UI upload/xóa ảnh địa điểm nổi bật */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Hình ảnh</label>
                                            <div className="flex items-center gap-4">
                                                {(editPopularPlacesImages[index]?.image || editPopularPlacesImages[index]?.oldImg) && (
                                                    <div className="relative">
                                                        <img
                                                            src={editPopularPlacesImages[index]?.image ? URL.createObjectURL(editPopularPlacesImages[index].image) : editPopularPlacesImages[index]?.oldImg}
                                                            alt={place.name}
                                                            className="w-20 h-20 object-cover rounded"
                                                        />
                                                        <IconButton
                                                            size="small"
                                                            className="absolute top-1 right-1 bg-white"
                                                            onClick={() => handleRemoveEditPopularPlaceImage(index)}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </div>
                                                )}
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    startIcon={<AddIcon />}
                                                    className={editPopularPlacesImages[index]?.image || editPopularPlacesImages[index]?.oldImg ? "h-10" : "h-20 w-20"}
                                                >
                                                    {editPopularPlacesImages[index]?.image || editPopularPlacesImages[index]?.oldImg ? 'Thay đổi ảnh' : 'Thêm ảnh'}
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept="image/*"
                                                        onChange={(e) => handleEditPopularPlaceImageChange(index, e.target.files[0])}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Divider className="my-4" />

                        <div className="space-y-4 mt-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">Câu hỏi phổ biến</h3>
                                <Button
                                    startIcon={<MdAdd />}
                                    onClick={handleAddPopularQuestion}
                                    variant="outlined"
                                    size="small"
                                >
                                    Thêm câu hỏi
                                </Button>
                            </div>
                            {editForm.popularQuestions.map((q, idx) => (
                                <div key={idx} className="border rounded-lg p-4 relative">
                                    <IconButton
                                        size="small"
                                        className="absolute top-2 right-2"
                                        onClick={() => handleRemovePopularQuestion(idx)}
                                    >
                                        <MdDelete />
                                    </IconButton>
                                    <div className="space-y-3">
                                        <TextField
                                            fullWidth
                                            label="Câu hỏi"
                                            value={q.Question}
                                            onChange={e => handlePopularQuestionChange(idx, 'Question', e.target.value)}
                                            variant="outlined"
                                            size="small"
                                        />
                                        <TextField
                                            fullWidth
                                            label="Câu trả lời"
                                            value={q.answer}
                                            onChange={e => handlePopularQuestionChange(idx, 'answer', e.target.value)}
                                            variant="outlined"
                                            multiline
                                            rows={2}
                                            size="small"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditModal} color="primary">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleUpdateCity}
                        color="primary"
                        variant="contained"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ManageCity; 