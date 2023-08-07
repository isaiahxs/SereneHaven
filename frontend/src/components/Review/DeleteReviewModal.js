import { useModal } from "../../context/Modal";
import './DeleteReviewModal.css'

const DeleteReviewModal = ({ reviewId, onDelete, onCancel }) => {
    const { closeModal } = useModal();

    return (
        <div className="delete-confirmation-modal">
            <h2 className="update-message">Are you sure you want to delete this review?</h2>
            <div className="manage-buttons">
                <button onClick={() => onDelete(reviewId)}>Yes (Delete Review)</button>
                <button onClick={() => {
                    onCancel();
                    closeModal();
                }}>No (Keep Review)</button>
            </div>
        </div>
    )
}

export default DeleteReviewModal;