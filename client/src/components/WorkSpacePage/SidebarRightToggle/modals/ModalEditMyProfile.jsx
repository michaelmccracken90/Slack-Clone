import React from "react";
import { Modal } from "semantic-ui-react";
import PropTypes from "prop-types";

import "./ModalEditMyProfile.scss";
import { ButtonOutline } from "@/components/common";
import { validateForm } from "@/utils";
import FormEditMyProfile from "./FormEditMyProfile";

class ModalEditMyProfile extends React.Component {
  toggleEditPassword = () => {
    const { updateFormFields, updateFormOptions, formOptions } = this.props;
    updateFormFields({
      password: "",
      newPassword: "",
      confirmPassword: ""
    });
    updateFormOptions({
      isEditPasswordOn: !formOptions.isEditPasswordOn
    });
  };

  uploadeFile = files => {
    const { updateFormOptions, createUploadError } = this.props;
    const file = files[0];
    if (file.size > 1024 * 1024 * 5) {
      createUploadError("file size exceed maximum upload size of 5 mb");
      return;
    }
    if (!file.type.startsWith("image/")) {
      createUploadError("Avatar file can only be image. i.e png, jpg");
      return;
    }
    updateFormOptions({ isImgUploaded: true, imgFile: file });
  };

  handleSave = () => {
    const {
      fetchEditUser,
      currentUser,
      toggleModal,
      resetForm,
      formOptions,
      setFieldErrors,
      formFields
    } = this.props;
    const formData = {
      ...formFields,
      ...formOptions
    };
    const fieldErrors = validateForm.editProfile(formData);
    setFieldErrors(fieldErrors);
    if (Object.keys(fieldErrors).length === 0) {
      if (this.editor) {
        const canvasScaled = this.editor.getImageScaledToCanvas();
        const base64PngImg = canvasScaled.toDataURL("image/png");
        fetchEditUser({
          currentUserId: currentUser.id,
          imgFile: base64PngImg,
          brief_description: formFields.feeling,
          detail_description: formFields.aboutMe,
          password: formFields.password,
          newPassword: formFields.newPassword
        });
      }

      fetchEditUser({
        currentUserId: currentUser.id,
        brief_description: formFields.feeling,
        detail_description: formFields.aboutMe,
        password: formFields.password,
        newPassword: formFields.newPassword
      });
      toggleModal();
      resetForm();
    }
  };

  toggleChangeAvatar = () => {
    const { updateFormOptions } = this.props;
    updateFormOptions({
      imgFile: {},
      changeAvatar: !updateFormOptions.changeAvatar,
      isImgUploaded: false
    });
  };

  changeImgScale = e => {
    const { updateFormOptions } = this.props;
    const sliderRange = e.target.value;
    if (sliderRange / 30 > 1) {
      const imgScale = sliderRange / 30;
      updateFormOptions({
        imgScale
      });
    }
    if (sliderRange / 30 < 1) {
      updateFormOptions({
        imgScale: 1
      });
    }
  };

  removeUploadImg = () => {
    const { updateFormOptions } = this.props;
    updateFormOptions({
      imgFile: {},
      isImgUploaded: false
    });
  };

  // eslint-disable-next-line
  setEditorRef = editor => (this.editor = editor);

  render() {
    const {
      formFields,
      formOptions,
      isModalOpen,
      fieldErrors,
      currentUser,

      toggleModal,
      handleFieldChange
    } = this.props;
    return (
      <React.Fragment>
        {isModalOpen && (
          <Modal size="large" open={isModalOpen} onClose={toggleModal}>
            <Modal.Content>
              <FormEditMyProfile
                formFields={formFields}
                formOptions={formOptions}
                fieldErrors={fieldErrors}
                currentUser={currentUser}
                toggleModal={toggleModal}
                handleFieldChange={handleFieldChange}
                toggleEditPassword={this.toggleEditPassword}
                uploadeFile={this.uploadeFile}
                handleSave={this.handleSave}
                toggleChangeAvatar={this.toggleChangeAvatar}
                changeImgScale={this.changeImgScale}
                removeUploadImg={this.removeUploadImg}
                setEditorRef={this.setEditorRef}
              />
            </Modal.Content>
          </Modal>
        )}
        {!isModalOpen && (
          <ButtonOutline
            cssClass="right-sidebar-item"
            text="Edit Profile"
            handleClick={toggleModal}
          />
        )}
      </React.Fragment>
    );
  }
}

ModalEditMyProfile.propTypes = {
  formFields: PropTypes.object.isRequired,
  formOptions: PropTypes.object.isRequired,
  fieldErrors: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  isModalOpen: PropTypes.bool.isRequired,

  resetForm: PropTypes.func.isRequired,
  handleFieldChange: PropTypes.func.isRequired,
  toggleModal: PropTypes.func.isRequired
};

export default ModalEditMyProfile;