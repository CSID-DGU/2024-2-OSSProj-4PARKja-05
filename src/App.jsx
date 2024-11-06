import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Main, Login, SignUp, MyPage, Intro, BoardList, BoardListShop, Search, BoardDetail, BoardWrite, 
        LocationSetting, SignUpChoice, SignUpCustomer, Settings, MyPageCustomer, ReserveNotice } from './pages/index';
import { RecoilRoot, atom, selector, useRecoilState, useRecoilValue } from 'recoil';


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/MyPage" element={<MyPage />} />
          <Route path="/MyPageCustomer" element={<MyPageCustomer />} />
          <Route path="/Settings" element={<Settings />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/SignUpChoice" element={<SignUpChoice />} />
          <Route path="/SignUpCustomer" element={<SignUpCustomer />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Search" element={<Search />} />
          <Route path="/BoardList" element={<BoardList />} />
          <Route path="/BoardListShop" element={<BoardListShop />} />
          <Route path="/LocationSetting" element={<LocationSetting />} />
          <Route path="/BoardDetail/:id" element={<BoardDetail />} />
          <Route path="/BoardWrite" element={<BoardWrite />} />
          <Route path="/ReseveNotice" element={<ReserveNotice />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App