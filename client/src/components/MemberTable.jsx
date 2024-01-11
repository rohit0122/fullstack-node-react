import React, { useEffect, useState } from "react";
import { dummyData } from "../contants/dummy";
import { Button, Image, Table } from "react-bootstrap";
import MemberFormModal from "./MemberFormModal";
import axios from "axios";
import { buildImageForView } from "../contants/global";
import DeleteMember from "./DeleteMember";
import Loader from "../components/Loader";

export default function MemberTable(props) {
  const [showLoader, setShowLoader] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [memberObj, setMemberObj] = useState({
    memberId: null,
    parentId: null,
    memberName: null,
    wholeMemberObject: null,
  });

  const [memberDataObj, setMemberDataObj] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleFormModalClose = () => setShowFormModal(false);
  const handleFormModalShow = () => setShowFormModal(true);

  const handleDeleteModalClose = () => setShowDeleteModal(false);
  const handleDeleteModalShow = () => setShowDeleteModal(true);

  const modifyMemberInfo = (
    memberId,
    parentId,
    memberName,
    wholeMemberObject = null
  ) => {
    let memberObjInfo = { ...memberObj };
    if (memberId) {
      // edit member
      memberObjInfo = { memberId, parentId, memberName, wholeMemberObject };
    } else if (parentId) {
      // add member
      memberObjInfo = { memberId: null, parentId: parentId, memberName, wholeMemberObject };
    }
//console.log('memberObjInfomemberObjInfomemberObjInfo', memberObjInfo)
    setMemberObj(memberObjInfo);
    handleFormModalShow();
  };

  const deleteMemberInfo = (memberId, memberName) => {
    let memberObjInfo = { ...memberObj, memberId, memberName };
    setMemberObj(memberObjInfo);
    handleDeleteModalShow();
  };

  const getMemberInfoFromAPI = async () => {
    await setShowLoader(true);
    let memberData = await axios.get(`${process.env.REACT_APP_LOCAL_SERVER_URL}api/member`);
    memberData = await memberData.data.data;
    //console.log("memberDatamemberDatamemberData", memberData);
    setMemberDataObj(memberData);
    await setShowLoader(false);

    //return memberData;
  };

  const exportAsCSV = async ()=>{
    let flatMemberObject = {...memberDataObj}; 
    //console.log('flatMemberObject====', flatMemberObject);
  }

  useEffect(() => {
    (async () => {
      try {
        await getMemberInfoFromAPI();
      } catch (err) {
        //console.log("Error occured when fetching books");
      }
    })();
  }, []);

  return (
    <>
    <div className="fixTableHead">
      <Button onClick={()=>exportAsCSV}>Export as CSV</Button>
      <Table bordered>
        <thead>
          <tr className="text-center">
            <th colSpan={10} className="bg-warning">
              Member info
            </th>
            <th colSpan={6} className="bg-info">
              Spouse info
            </th>
          </tr>
          <tr>
            <th width={"10px"}>Sr#</th>
            <th className="bg-warning" width={"150px"}>
              Member#
            </th>
            <th className="bg-warning">Parent#</th>
            <th className="bg-warning">Name</th>
            <th className="bg-warning" width={"100px"}>
              Mobile
            </th>
            <th className="bg-warning" width={"250px"}>
              Address
            </th>
            <th className="bg-warning" width={"50px"}>
              gender
            </th>
            <th className="bg-warning" width={"75px"}>
              photo
            </th>
            <th className="bg-warning" width={"120px"}>
              dob
            </th>
            <th className="bg-warning" width={"120px"}>
              dod
            </th>

            <th className="bg-info">Name</th>
            <th className="bg-info" width={"100px"}>
              Mobile
            </th>
            <th className="bg-info" width={"50px"}>
              gender
            </th>
            <th className="bg-info" width={"75px"}>
              photo
            </th>
            <th className="bg-info" width={"120px"}>
              dob
            </th>
            <th className="bg-info" width={"120px"}>
              dod
            </th>
          </tr>
        </thead>
        <tbody>
          {memberDataObj.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>
                <div className="d-flex flex-column gap-1">
                  {item.id === 0 ? "Place of origin" : item.id}
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      modifyMemberInfo(
                        item.id,
                        "",
                        item.memberInfo.fullName,
                        item
                      )
                    }
                  >
                    Edit Info
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() =>
                      modifyMemberInfo(0, item.id, item.memberInfo.fullName)
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-person-fill-add"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z" />
                    </svg>{" "}
                    Add Child
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() =>
                      deleteMemberInfo(item.id, item.memberInfo.fullName)
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-trash-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                    </svg>{" "}
                    Delete
                  </Button>
                </div>
              </td>
              <td>{item.parentId == "" ? "None" : item.parentId}</td>
              <td>{item.memberInfo.fullName}</td>
              <td>{item.memberInfo.mobile}</td>
              <td>{item.memberInfo.address}</td>
              <td>{item.memberInfo.gender ? "Male" : "Female"}</td>
              <td>
                <Image
                  src={buildImageForView(
                    item.memberInfo.photo,
                    item.memberInfo.gender,
                    item.id
                  )}
                  width={75}
                  height={75}
                />
              </td>
              <td>{item.memberInfo.dob}</td>
              <td>{item.memberInfo.dod}</td>
              {item.spouseInfo.fullName ? (
                <>
                  <td>{item.spouseInfo.fullName}</td>
                  <td>{item.spouseInfo.mobile}</td>
                  <td>{item.spouseInfo.gender ? "Male" : "Female"}</td>
                  <td>
                    <Image
                      src={buildImageForView(
                        item.spouseInfo.photo,
                        item.spouseInfo.gender,
                        item.id
                      )}
                      width={75}
                      height={75}
                    />
                  </td>
                  <td>{item.spouseInfo.dob}</td>
                  <td>{item.spouseInfo.dod}</td>
                </>
              ) : (
                <td className="text-center" colSpan={6}>
                  No Spouse
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      </div>
      {showFormModal && (
        <MemberFormModal
          handleClose={handleFormModalClose}
          memberObj={memberObj}
          loadLatestMemberInfo={getMemberInfoFromAPI}
          showLoader={setShowLoader}
        />
      )}

      {showDeleteModal && (
        <DeleteMember
          handleClose={handleDeleteModalClose}
          memberObj={memberObj}
          loadLatestMemberInfo={getMemberInfoFromAPI}
          showLoader={setShowLoader}
        />
      )}
    <Loader show={showLoader} />
    </>
  );
}
