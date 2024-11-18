import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import { SlArrowLeft } from "react-icons/sl";
import { Input, CommonButton, Flx, IntroLayout } from '../../components/element';
import { useMutation } from 'react-query';
import { getIdChk, userSignup } from '../../api/users';  
import DaumPostcode from 'react-daum-postcode';

function SignUp() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // 모달 상태를 위한 state 추가

    const completeHandler = data => {
        console.log(data);
    };

    // Input창 저장용 state
    const [input, setInput] = useState({  
        userId: '',
        password: '',
        pwConfirm: '',
        nickname: '',
        time: '', 
        userType: 'owner',
    });

    // 모달 토글 함수
    const toggleModal = () => {
        setIsOpen(!isOpen); // 모달 상태를 토글
    };

    const onChangeInputHandler = (e) => {
        const { id, value } = e.target;
        setInput({
            ...input,
            [id]: value,
        });
    };

    const onIdChkHandler = (e) => {
        e.preventDefault();
        getIdChk(input.userId);
    };

    // 가입하기 버튼 클릭 이벤트핸들러
    const onSubmitJoinHandler = (e) => {
        e.preventDefault();
        const userInfo = {
            userId: input.userId,
            password: input.password,
            nickname: input.nickname,
            time: input.time
        };
        const userType = 'owner'; 
        userSignup(userInfo, userType);
        navigate('/Login');
    };

    return (
        <IntroLayout>
            <Backbutton type='button' onClick={() => navigate(-1)}><SlArrowLeft /></Backbutton>
            <h1 style={{marginTop:"40px",marginBottom:"0px"}}>회원가입</h1>
            <StForm>
                <div>
                    <Flx>
                        <label htmlFor='nickname'>상점명</label>
                        <Input 
                            type="text" 
                            value={input.nickname} 
                            id='nickname' 
                            placeholder='정확한 상점명' 
                            onChange={onChangeInputHandler}
                        />
                        {input.nickname.length > 0 ? null : <p className='alertText'>정확한 상점명을 입력해 주세요.</p>}
                    </Flx>

                    <Flx>
                        <label htmlFor='userId'>아이디</label>
                        <StyledInput 
                            type="text" 
                            value={input.userId} 
                            id='userId' 
                            placeholder='5~10글자 사이 영문 소문자,숫자' 
                            onChange={onChangeInputHandler}
                        />
                        <CommonButton size='small' onClick={(e) => onIdChkHandler(e, input.userId)}>중복확인</CommonButton>
                        {
                            /^[a-z0-9]{8,15}$/.test(input.userId) ? null : 
                            <p className='alertText'>8~15글자 사이 영문 소문자,숫자를 사용하세요.</p>
                        }
                    </Flx>
                    
                    <Flx>
                        <label htmlFor='password'>패스워드</label>
                        <Input 
                            type="password" 
                            value={input.password} 
                            id='password' 
                            placeholder='8~15글자 사이 영문,숫자,특수문자' 
                            onChange={onChangeInputHandler}
                        />
                        {
                            /^[a-zA-Z0-9!@#$%^&*()\-_=+{};:,.<>?[\]\\/]{8,15}$/.test(input.password) ? null : 
                            <p className='alertText'>8~15글자 사이 영문,숫자,특수문자를 사용하세요.</p>
                        }
                    </Flx>

                    <Flx>
                        <label htmlFor='pwConfirm'>중복확인</label>
                        <Input 
                            type="password" 
                            value={input.pwConfirm} 
                            id='pwConfirm' 
                            placeholder='비밀번호 확인을 위해 한번 더 입력해주세요' 
                            onChange={onChangeInputHandler}
                        />
                        {
                            input.password === input.pwConfirm ? null : 
                            <p className='alertText'>비밀번호가 일치하지 않습니다.</p>
                        }
                    </Flx>

                    <Flx>
                        <label htmlFor='time'>영업시간</label>
                        <Input 
                            type="text" 
                            value={input.time} 
                            id="time" 
                            placeholder='ex) 매일 10:00 - 22:00' 
                            onChange={onChangeInputHandler}
                        />
                    </Flx>

                    {/* 주소검색 모달 열기 버튼 */}
                    <div onClick={toggleModal}>주소검색</div>
                    {isOpen && (
                        <div>
                            <DaumPostcode onComplete={completeHandler} />
                        </div>
                    )}
                </div>
                <CommonButton onClick={onSubmitJoinHandler} size='large'>가입하기</CommonButton>
            </StForm>
        </IntroLayout>
    );
}

export default SignUp;

const Backbutton = styled.button`
    position:relative;
    top:20px;
    left:0;
    border:none;
    background-color:transparent;
    font-size:22px;
    color:#777;
`;
const StForm = styled.form`
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    height:calc(100vh - 190px);
    padding-top:30px;
    box-sizing:border-box;
    &>div>div{
        position:relative;
    }

    & label{
        display:inline-block;
        width:65px;
        line-height:43px;
        font-weight:500;
    }
    & .alertText{
        position:absolute;
        top:45px;
        display:inline-block;
        color:#f00;
        margin:3px 0 25px;
        transform:translateX(70px);
        font-size:0.8rem;
    }
    & input{
        display:inline-block;
        width:calc(100% - 65px);
        margin-bottom:35px;
    }
`;
const StyledInput = styled(Input)`
  display: inline-block;
  width:calc(100% - 168px) !important;
  margin-right:8px;
`;
