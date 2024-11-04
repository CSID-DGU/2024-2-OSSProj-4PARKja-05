import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Main, Login, SignUp, MyPage, Intro, BoardList, Search, BoardDetail, BoardWrite, 
        LocationSetting, SignUpChoice, SignUpCustomer, Settings, MyPageCustomer } from './pages/index';
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
          <Route path="/LocationSetting" element={<LocationSetting />} />
          <Route path="/BoardDetail/:id" element={<BoardDetail />} />
          <Route path="/BoardWrite" element={<BoardWrite />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App