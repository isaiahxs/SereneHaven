import { deleteReviewThunk } from "../../store/reviews";
import { useModal } from "../../context/Modal";

const DeleteReviewModal = ({reviewId, onDelete, onCancel}) => {
    const {closeModal} = useModal();

    return (
        <div className="delete-confirmation-modal">
            <h3>Are you sure you want to delete this review?</h3>
            <div>
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
