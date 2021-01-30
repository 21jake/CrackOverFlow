import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


const DeleteModal = (props) => {
    const  { prompt, handleComfirm } = props;
    // (post, 'post');
    return (
        <Modal className="m-3" isOpen={props.modal} toggle={() => props.toggle()} className="deleteModal">
            <ModalHeader toggle={() => props.toggle()}>
                <span>Xác nhận xóa</span>
            </ModalHeader>
            <ModalBody className="text-left">
                <span>{prompt}</span>
            </ModalBody>
            <ModalFooter>
                <Button style={{ backgroundColor: '#ffffff', border: '1px solid #666666', color: '#666666' }}
                    onClick={() => props.toggle()}>
                    <span>Hủy</span>
                </Button>
                <Button color="danger" onClick={() => handleComfirm()}>
                    <span>Xóa</span>
                </Button>
            </ModalFooter>
        </Modal>
    )
}

export default DeleteModal;