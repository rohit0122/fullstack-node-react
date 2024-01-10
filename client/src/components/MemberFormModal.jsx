import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import * as formik from "formik";
import * as yup from "yup";
import Modal from "react-bootstrap/Modal";
import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { blankMemberObj } from "../contants/memberObj";
import { dummyData } from "../contants/dummy";
import axios from "axios";

function MemberFormModal(props) {
  const { Formik } = formik;
  const [showSpouse, setShowSpouse] = useState(false);
  const [formInitialObj, setFormInitialObj] = useState({
    fullName: props.memberObj.wholeMemberObject?.memberInfo?.fullName,
    primaryMobile: props.memberObj.wholeMemberObject?.memberInfo?.mobile,
    address: props.memberObj.wholeMemberObject?.memberInfo?.address,
    primaryGender: props.memberObj.wholeMemberObject?.memberInfo?.gender,
    dateOfBirth: props.memberObj.wholeMemberObject?.memberInfo?.dob,
    dateOfDemise: props.memberObj.wholeMemberObject?.memberInfo?.dod,
    primaryPhoto: props.memberObj.wholeMemberObject?.memberInfo?.photo,

    /** Spouse details */
    spouseFullName: props.memberObj.wholeMemberObject?.spouseInfo?.fullName,
    spouseMobile: props.memberObj.wholeMemberObject?.spouseInfo?.mobile,
    spouseGender: props.memberObj.wholeMemberObject?.spouseInfo?.gender,
    spouseDob: props.memberObj.wholeMemberObject?.spouseInfo?.dob,
    spouseDod: props.memberObj.wholeMemberObject?.spouseInfo?.dod,
    spousePhoto: props.memberObj.wholeMemberObject?.spouseInfo?.photo,
  });

  const schema = yup.object().shape({
    fullName: yup.string().required("Full name is required."),
    primaryMobile: yup
      .string()
      .required("Primary mobile is required.")
      .matches(/^[6-9]\d{9}$/, {
        message: "Please enter valid primary mobile number.",
        excludeEmptyString: false,
      }),
    primaryGender: yup.bool().required("Primary gender is required."),
    address: yup.string().required("Primary address is required."),
    primaryPhoto: yup.mixed().required("Primary photo is required."),
    dateOfBirth: yup.date().required("Primary date of birth is required."),
    dateOfDemise: yup.date(),

    /** Spouse details */
    spouseFullName: yup.string("Spouse full name is required."),
    spouseMobile: yup.string().matches(/^[6-9]\d{9}$/, {
      message: "Please enter valid spouse mobile number.",
      excludeEmptyString: false,
    }),
    spouseGender: yup.bool().required("Spouse gender is required."),
    spouseDob: yup.date("Spouse dob is required."),
    spouseDod: yup.date(),
    spousePhoto: yup.mixed(),
  });
  //console.log("propspropspropspropsprops", props.memberObj);

  const updateMemberInfoInDb = async (memberObj, isNewEntry = false) => {
    const dataToSend = { data: { memberObj, isNewEntry } };
    await axios
      .post(`${process.env.REACT_APP_LOCAL_SERVER_URL}api/member`, dataToSend)
      .then((response) => {
        console.log("API Response ", response);
        alert('Member information saved.');
      });
  };

  const handleUploadImage = async (memberId, primaryPhoto, spousePhoto) => {
    if (primaryPhoto || spousePhoto) {
      const dataToSend = { primaryPhoto, spousePhoto };
      let uploadImageInfo = await axios.post(
        `${process.env.REACT_APP_LOCAL_SERVER_URL}api/uploadImage`,
        dataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            // 'Accept': 'application/json',
          },
        }
      );
      uploadImageInfo = await uploadImageInfo.data.data;
      return uploadImageInfo;
    }
    return {};
  };
  const processSubmittedForm = async (formData) => {
    //console.log(' props.memberObj',  props.memberObj)
    let randomValue = "";
    let newMemberId = "";
    let memberObjData = "";
    let isNewEntry = null === props.memberObj.memberId;
    console.log("isNewEntryisNewEntryisNewEntryisNewEntry", isNewEntry);
    if (isNewEntry) {
      randomValue = Math.random().toString().substring(2, 6);
      newMemberId = await parseInt(
        `${randomValue}${new Date()
          .getTime()
          .toString()
          .split("")
          .reverse()
          .join("")
          .substring(0, 4)}`
      );
      memberObjData = Object.assign(blankMemberObj, {});
    }

    /*console.log("FOrm Data", formData);
    console.log("FOrm Data", typeof formData.primaryPhoto.name);
    console.log("FOrm Data", typeof formData.spousePhoto.name);*/

    const uploadedImageInfo = await handleUploadImage(
      newMemberId,
      typeof formData.primaryPhoto?.name === "string"
        ? formData.primaryPhoto
        : "",
      typeof formData.spousePhoto?.name === "string" ? formData.spousePhoto : ""
    );

    memberObjData = {
      ...memberObjData,
      id: (isNewEntry ? newMemberId : props.memberObj.memberId),
      parentId: (isNewEntry ?  props.memberObj.parentId : props.memberObj.wholeMemberObject.parentId),
      memberInfo: {
        fullName: formData.fullName,
        mobile: formData.primaryMobile,
        address: formData.address,
        gender: formData.primaryGender,
        photo: (uploadedImageInfo.primaryPhoto ? uploadedImageInfo.primaryPhoto : props.memberObj.wholeMemberObject?.memberInfo?.photo),
        dob: formData.dateOfBirth,
        dod: formData.dateOfDemise,
      },
      spouseInfo: {
        fullName: formData.spouseFullName,
        mobile: formData.spouseMobile,
        address: formData.address,
        gender: formData.spouseGender,
        photo: (uploadedImageInfo.spousePhoto ? uploadedImageInfo.spousePhoto: props.memberObj.wholeMemberObject?.spousePhoto?.photo),
        dob: formData.spouseDob,
        dod: formData.spouseDod,
      },
    };
    console.log("memberObjDatamemberObjData", memberObjData);
    //let finalDataObj = Object.assign(dummyData, {});
    //finalDataObj.push(memberObjData);
    //console.log('finalDataObjfinalDataObjfinalDataObjfinalDataObj', finalDataObj);
//return;
    await updateMemberInfoInDb(memberObjData, isNewEntry);
    await props.loadLatestMemberInfo();
    await props.handleClose();
  };

  return (
    <Modal show={true} onHide={props.handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {props.memberObj.memberId === null
            ? `Add member under`
            : `Update member info for`}{" "}
          <i>{props.memberObj.memberName}</i>
        </Modal.Title>
      </Modal.Header>

      <Formik
        validationSchema={schema}
        onSubmit={processSubmittedForm}
        initialValues={formInitialObj}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          touched,
          errors,
          setFieldValue,
        }) => (
          <Form
            noValidate
            onSubmit={handleSubmit}
            encType="multipart/form-data"
          >
            <>
              <Modal.Body>
                {Object.keys(errors).length > 0 && (
                  <Alert
                    variant="danger"
                    className="d-flex justify-content-between"
                  >
                    <ul className="mb-0">
                      {errors.fullName && <li>{errors.fullName}</li>}
                      {errors.primaryMobile && <li>{errors.primaryMobile}</li>}
                      {errors.address && <li>{errors.address}</li>}
                      {errors.primaryGender && <li>{errors.primaryGender}</li>}
                      {errors.dateOfBirth && <li>{errors.dateOfBirth}</li>}
                      {errors.primaryPhoto && <li>{errors.primaryPhoto}</li>}
                    </ul>
                    <ul className="mb-0">
                      {errors.spouseFullName && (
                        <li>{errors.spouseFullName}</li>
                      )}
                      {errors.spouseMobile && <li>{errors.spouseMobile}</li>}
                      {errors.spouseDob && <li>{errors.spouseDob}</li>}
                    </ul>
                  </Alert>
                )}
                <div className={`${!showSpouse ? "" : "d-none"}`}>
                  <Row className="mb-3">
                    <Form.Group
                      as={Col}
                      md="8"
                      controlId="validationFormik107"
                      className="position-relative"
                    >
                      <Form.Label>Full name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Full name"
                        name="fullName"
                        value={values.fullName}
                        onChange={handleChange}
                        isInvalid={!!errors.fullName}
                      />
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="validationFormik105"
                      className="position-relative"
                    >
                      <Form.Label>Mobile</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Mobile"
                        name="primaryMobile"
                        value={values.primaryMobile}
                        onChange={handleChange}
                        isInvalid={!!errors.primaryMobile}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group
                      as={Col}
                      md="10"
                      controlId="validationFormik103"
                      className="position-relative"
                    >
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Address"
                        name="address"
                        value={values.address}
                        onChange={handleChange}
                        isInvalid={!!errors.address}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md="2"
                      controlId="validationFormik108"
                      className="position-relative"
                    >
                      <Form.Label>Gender </Form.Label>
                      <Form.Check
                        type="switch"
                        name="primaryGender"
                        value={values.primaryGender}
                        onChange={handleChange}
                      />
                      {values.primaryGender ? "Male" : "Female"}
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group
                      className="position-relative mb-3"
                      as={Col}
                      md="6"
                    >
                      <Form.Label>Primary photo</Form.Label>
                      <Form.Control
                        type="file"
                        required
                        name="primaryPhoto"
                        accept="image/*"
                        //onChange={handleChange}
                        onChange={(e) =>
                          setFieldValue(
                            "primaryPhoto",
                            e.currentTarget.files[0]
                          )
                        }
                        isInvalid={!!errors.primaryPhoto}
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationFormikDob">
                      <Form.Label>Date of birth</Form.Label>
                      <InputGroup hasValidation>
                        <Form.Control
                          type="date"
                          placeholder="Date of birth"
                          aria-describedby="inputGroupPrepend"
                          name="dateOfBirth"
                          value={values.dateOfBirth}
                          onChange={handleChange}
                          isInvalid={!!errors.dateOfBirth}
                        />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} md="3" controlId="validationFormikDod">
                      <Form.Label>Date of demise (if any)</Form.Label>
                      <InputGroup hasValidation>
                        <Form.Control
                          type="date"
                          placeholder="Date of demise"
                          aria-describedby="inputGroupPrepend"
                          name="dateOfDemise"
                          value={values.dateOfDemise}
                          onChange={handleChange}
                          isInvalid={!!errors.dateOfDemise}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Row>
                </div>
                <div className={`${showSpouse ? "" : "d-none"}`}>
                  <Row className="mb-3">
                    <Form.Group
                      as={Col}
                      md="8"
                      controlId="validationFormik111"
                      className="position-relative"
                    >
                      <Form.Label>Spouse full name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Spouse full name"
                        name="spouseFullName"
                        value={values.spouseFullName}
                        onChange={handleChange}
                        isInvalid={!!errors.spouseFullName}
                      />
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="validationFormik112"
                      className="position-relative"
                    >
                      <Form.Label>Spouse Mobile</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Mobile"
                        name="spouseMobile"
                        value={values.spouseMobile}
                        onChange={handleChange}
                        isInvalid={!!errors.spouseMobile}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-3">
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="validationFormik113"
                      className="position-relative"
                    >
                      <Form.Label>Spouse Gender </Form.Label>
                      <Form.Check
                        type="switch"
                        name="spouseGender"
                        value={values.spouseGender}
                        onChange={handleChange}
                      />
                      {values.spouseGender ? "Male" : "Female"}
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="validationFormikSpouseDob"
                    >
                      <Form.Label>Spouse Date of birth</Form.Label>
                      <InputGroup hasValidation>
                        <Form.Control
                          type="date"
                          placeholder="Date of birth"
                          aria-describedby="inputGroupPrepend"
                          name="spouseDob"
                          value={values.spouseDob}
                          onChange={handleChange}
                          isInvalid={!!errors.spouseDob}
                        />
                      </InputGroup>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md="4"
                      controlId="validationFormikSpouseDod"
                    >
                      <Form.Label>Spouse Date of demise (if any)</Form.Label>
                      <InputGroup hasValidation>
                        <Form.Control
                          type="date"
                          placeholder="Date of demise"
                          aria-describedby="inputGroupPrepend"
                          name="spouseDod"
                          value={values.spouseDod}
                          onChange={handleChange}
                          isInvalid={!!errors.spouseDod}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group className="position-relative mb-3" as={Col}>
                      <Form.Label>Spouse photo</Form.Label>
                      <Form.Control
                        type="file"
                        required
                        accept="image/*"
                        name="spousePhoto"
                        //onChange={handleChange}
                        onChange={(e) =>
                          setFieldValue("spousePhoto", e.currentTarget.files[0])
                        }
                        isInvalid={!!errors.spousePhoto}
                      />
                    </Form.Group>
                  </Row>
                </div>
              </Modal.Body>
              <Modal.Footer>
                {!showSpouse && (
                  <Button
                    className="flex-grow-1"
                    type="submit"
                    variant="success"
                  >
                    Submit
                  </Button>
                )}
                <Button
                  variant={`${showSpouse ? "primary" : "link"}`}
                  onClick={() => setShowSpouse(!showSpouse)}
                >
                  {!showSpouse ? "Update Spouse" : "Save Spouse & Go Back"}
                </Button>
              </Modal.Footer>
            </>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default MemberFormModal;
