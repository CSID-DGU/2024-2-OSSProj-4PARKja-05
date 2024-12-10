const express = require('express');
const { checkAuthMiddleware } = require('../util/auth');
const { getReservationStatus, reservationToggle, getMyReservations, ownerProductReservationList,reservationOwnerCancel,transactionCompleted } = require('../controllers/reservation');
const router = express.Router();

// 예약한 목록 가져오기 -  /api/reservations/mine
router.get('/mine', checkAuthMiddleware, getMyReservations);

//사장짐 예약된 목록 가져오기
router.get('/owner/posts',checkAuthMiddleware, ownerProductReservationList);


// 예약하기 상태 가져오기  -  /api/reservations/:postId
router.get('/:postId', checkAuthMiddleware, getReservationStatus);


// 예약하기 상태 토글 -  /api/reservations/:postId
router.post('/:postId', checkAuthMiddleware, reservationToggle);

//사장님 예약 취소
router.post('/ownerCancel/:postId', checkAuthMiddleware, reservationOwnerCancel);

//사장님 거래완료
router.post('/transactionCompleted/:postId', checkAuthMiddleware, transactionCompleted);



module.exports = router;