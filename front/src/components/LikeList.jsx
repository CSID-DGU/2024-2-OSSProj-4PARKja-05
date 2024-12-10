import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NullAlert from '../pages/statusPage/NullAlert';
import { ownerProductLikeList } from '../api/likes';
import { ownerProductReservationList, reservationOwnerCancel , transactionCompleted} from '../api/reservations';
import UserList from './UserList';
import { useNavigate } from 'react-router-dom';
import { categoryKor } from '../utils/auth';
import StatusButtonSelect from './common/StatusButtonSelect';
import { getImageSrc } from '../utils/commonUtils';
import { useMutation } from 'react-query';
import ConfirmModal from './element/ConfirmModal';




function LikeList({ listType }) {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [confirmAction, setConfirmAction] = useState(null);

    const fetchData = async () => {
        try {
            const response = listType === 'like'
                ? await ownerProductLikeList()
                : await ownerProductReservationList();
            setData(response || []);
        } catch (error) {
            console.error(`${listType} 데이터 로드 실패:`, error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleReservationMutation = useMutation((item) => reservationOwnerCancel(item), {
        onSuccess: fetchData,
        onError: () => alert('예약 상태 변경에 실패했습니다. 다시 시도해주세요.'),
    });

    const transactionCompletedMutation = useMutation((item) => transactionCompleted(item), {
        onSuccess: fetchData,
        onError: () => alert('거래 상태 변경에 실패했습니다. 다시 시도해주세요.'),
    });

    const handleCancel = (item) => {
        setModalMessage('정말 예약을 취소하시겠습니까?');
        setConfirmAction(() => () => toggleReservationMutation.mutate(item));
        setIsModalOpen(true);
    };

    const handleComplete = (item) => {
        setModalMessage('정말 거래를 완료하시겠습니까?');
        setConfirmAction(() => () => transactionCompletedMutation.mutate(item));
        setIsModalOpen(true);
    };

    return (
        <>
            <ConfirmModal
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                message={modalMessage}
                onConfirm={confirmAction}
            />
            {data.length === 0 ? (
                <NullAlert alertMessage={
                    listType === 'like' ? "찜된 상품이 없습니다." : "예약된 상품이 없습니다."
                } />
            ) : (
                data.map((item, index) => (
                    <ItemBox key={item.postId} isEven={index % 2 === 1}>
                        <ItemArea>
                            <ImgBox onClick={() => navigate(`/BoardDetail/${item.postId}`)}>
                                <img src={getImageSrc(item.image)} alt="상품 이미지" />
                            </ImgBox>
                            <Info>
                                <H4Tag>상품명: <span>{item.title}</span></H4Tag>
                                <H4Tag>카테고리: <span>{categoryKor(item.category)}</span></H4Tag>
                                <H4Tag>가격: <span>{item.price.toLocaleString()} 원</span></H4Tag>
                                <H4Tag>판매상태: <StatusButtonSelect status={item.status} /></H4Tag>
                                
                                {item.reservations && (
                                    <>
                                        <Button variant="cancel" onClick={() => handleCancel(item)}>
                                            예약취소
                                        </Button>
                                        <Button  variant="complete" onClick={() => handleComplete(item)}>
                                            거래완료
                                        </Button>
                                    </>
                                )}


                                {item.likes && <UserList title="찜 유저목록" users={item.likes} />}
                                {item.reservations && <UserList title="예약 유저목록" users={item.reservations} />}
                            </Info>
                        </ItemArea>
                    </ItemBox>
                ))
            )}
        </>
    );
}

export default LikeList;


// 스타일 정의
const ItemBox = styled.div`
    border-bottom: 1px solid #ccc;
    padding: 15px;
    background-color: ${({ isEven }) => (isEven ? '#f9f9f9' : 'white')};
    transition: background-color 0.3s ease;
    cursor: pointer;
    &:hover {
        background-color: #e0e0e0; /* 마우스 오버 시 배경색 */
    }
        
`;

const ItemArea = styled.div`
    display: flex;
    align-items: center;
`;

const ImgBox = styled.div`
    width: 110px;
    height: 110px;
    overflow: hidden;
    border-radius: 10px;
    & img {
        width: 100%;
        height: 100%;
    }
`;

const Info = styled.div`
    width: calc(100% - 130px);
    padding-left: 20px;
    & h2 {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
    }
    & p {
        margin: 0;
        color: #777;
    }
`;
const H4Tag=styled.h4`
    font-size: 14px;
    font-weight: 500;
`;

// 버튼 스타일 추가
const Button = styled.button`
    background-color: ${({ variant }) => (variant === 'cancel' ? '#e66f24' : '#4caf50')}; /* 예약취소는 빨간색, 거래완료는 초록색 */
    color: white;
    border: none;
    border-radius: 5px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background-color: ${({ variant }) => (variant === 'cancel' ? '#ff7875' : '#66bb6a')}; /* 호버 시 밝은 색 */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    &:active {
        transform: scale(0.98); /* 클릭 시 약간 축소 */
    }

    &:disabled {
        background-color: #d9d9d9; /* 비활성화된 상태는 회색 */
        color: #a0a0a0;
        cursor: not-allowed;
    }

    & + & {
        margin-left: 10px; /* 버튼 간 간격 추가 */
    }
`;