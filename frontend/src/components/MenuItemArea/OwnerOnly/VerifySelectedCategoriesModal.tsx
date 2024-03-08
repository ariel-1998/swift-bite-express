import { Category } from "../../../models/Category";
import Button from "../../Customs/Button";
import Modal from "../../Customs/Modal";

type VerifySelectedCategoriesModalProps = {
  selectedCategories?: Category[];
  close: () => void;
};
function VerifySelectedCategoriesModal({
  close,
}: VerifySelectedCategoriesModalProps) {
  return (
    <Modal close={close}>
      <div className="flex flex-col items-center gap-1 font-semibold">
        <h2 className="font-bold text-xl text-error mb-1">Warning</h2>
        <span>You are trying to Add Menu Item with no Category</span>
        <span>Are you sure you want to proceed?</span>
        <div className="flex gap-1">
          <Button type="submit" variant={"primary"}>
            Proceed
          </Button>
          <Button type="button" onClick={close} variant={"error"}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default VerifySelectedCategoriesModal;
