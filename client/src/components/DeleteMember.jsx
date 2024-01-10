import axios from "axios";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function DeleteMember(props) {
  //console.log("PROPS:::::::", props.memberObj);

  const [deleteApiRes, setDeleteApiRes] = useState({});

  const deleteMemberInfo = async (memberId) => {
    await props.showLoader(true);

    let apiRes = await axios.delete(
      `${process.env.REACT_APP_LOCAL_SERVER_URL}api/member/${memberId}`
    );
    apiRes = await apiRes.data;
    //return memberData;
    console.log('apiResapiResapiResapiRes', apiRes)
    setDeleteApiRes(apiRes);
    await props.loadLatestMemberInfo();
    setTimeout(props.handleClose, 1000);
    await props.showLoader(false);
  };

  return (
    <>
      <Modal show={true} onHide={props.handleClose} animation={false} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(deleteApiRes).length > 0 && 
            <Alert variant={deleteApiRes.status}><strong>{deleteApiRes.message}</strong></Alert>
          }
          <h5 className="text-danger">
            Are you sure to delete <strong>{props.memberObj.memberName}</strong>
            ?
          </h5>
          <small className="">
            All children belongs this member will be deleted.
          </small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            No
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteMemberInfo(props.memberObj.memberId)}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DeleteMember;
