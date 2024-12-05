import React from "react";
import { styled } from "styled-components";

const ConfirmModal = ({ 
  isModalOpen, 
  setIsModalOpen, 
  message, 
  onConfirm, 
  onCancel 
}) => {

  const handleClose = () => {
    setIsModalOpen(false);
    if (onCancel) onCancel();
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    if (onConfirm) onConfirm();
  };

  if (!isModalOpen) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <p>{message}</p>
        <ButtonGroup>
          <button onClick={handleConfirm}>확인</button>
          <button onClick={handleClose}>취소</button>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ConfirmModal;

// 스타일 정의
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);

  p {
    margin-bottom: 20px;
    font-size: 16px;
    font-weight: bold;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;

  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;

    &:first-child {
      background-color: #5ca771;
      color: white;
    }

    &:last-child {
      background-color: #ff4d4f;
      color: white;
    }
  }
`;
