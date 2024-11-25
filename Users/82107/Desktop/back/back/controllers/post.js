const { Post, Hashtag } = require('../models');
const { User } = require('../models');

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};

// 게시물작성!
exports.uploadPost = async (req, res, next) => {
  console.log("게시물작성 입력 데이터: ", req.body);
  const { title, content, category, image, original_price, discount_rate, sale_end_date } = req.body;

  if (!category || !['bread', 'rice_cake', 'side_dish', 'grocery', 'etc']
    .includes(category)) {
    return res.status(400).json({ responseMessage: '카테고리를 선택해주세요.' });
  }

  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      original_price: req.body.original_price,
      discount_rate: req.body.discount_rate,
      sale_end_date: req.body.sale_end_date,
      category: req.body.category,
      image: req.file ? `/uploads/${req.file.filename}` : null,  // 프론트로의 이미지 건네주는 경로
      UserId: req.user.id,
    });

    return res.status(201).json({ 
      id: post.id,
      responseMessage: '게시물이 성공적으로 작성되었습니다.', post });
  } 
  catch (error) {
    console.error(error);
    return next(error);
  }
};



// 게시물 목록을 가져와 JSON 형식으로 응답하는 컨트롤러
exports.getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 0; // 페이지 번호, 기본값 0
    const size = parseInt(req.query.size, 10) || 10; // 페이지당 항목 수, 기본값 10
    const sort = req.query.sort ? req.query.sort.split(',') : ['createdAt', 'DESC']; // 정렬 기준, 기본값: createdAt 기준 내림차순

    const offset = page * size;
    const limit = size;
    const order = [[sort[0], sort[1].toUpperCase()]]; // 정렬 기준과 순서 설정

    const posts = await Post.findAll({
      offset: page * size,
      limit: size,
      order: [sort],
      include: [
        {
          model: User,
          attributes: ['id', 'nick'], // 작성자의 정보
        },
      ],
    });

    // 프론트엔드에서 기대하는 데이터 형식으로 변환하여 응답
    const responseDtos = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      image: post.image, // 이미지 경로
      category: post.category, // 카테고리 정보
      original_price: post.original_price, // 원래 가격
      discount_rate: post.discount_rate, // 할인율
      price: post.original_price * (1 - post.discount_rate / 100), // 할인가 계산
      sale_end_date: post.sale_end_date, // 판매 종료일
      status: post.sale_end_date && new Date(post.sale_end_date) < new Date() ? '거래완료' : '판매중', // 판매 상태
      nickname: post.User.nick, // 상점명 (사장님 닉네임)
    }));

    return res.status(200).json({
      data: {
        responseDtos: responseDtos,
        page: page,
        size: size,
      }
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};




// 게시물 상세 조회
exports.getPostDetail = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const post = await Post.findOne({
      where: { id: boardId },
      include: {
        model: User,
        attributes: ['nick', 'address'],
      },
    });

    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }

    res.status(200).json({ data: post });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


// 게시물 수정
exports.editPost = async (req, res, next) => {
  try {
    const { boardId } = req.params;
    const { title, content, original_price, discount_rate, sale_end_date, category, image } = req.body;

    const post = await Post.findOne({ where: { id: boardId } });

    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }

    await post.update({
      title,
      content,
      original_price,
      discount_rate,
      sale_end_date,
      category,
      image,
    });

    res.status(200).json({ message: '게시물이 수정되었습니다.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};


// 게시물 삭제
exports.deletePost = async (req, res, next) => {
  try {
    const { boardId } = req.params;

    const post = await Post.findOne({ where: { id: boardId } });

    if (!post) {
      return res.status(404).json({ message: '게시물을 찾을 수 없습니다.' });
    }

    await post.destroy();

    res.status(200).json({ message: '게시물이 삭제되었습니다.' });
  } catch (error) {
    console.error(error);
    next(error);
  }
};



// 상점별 게시물 조회

// controllers/post.js

exports.getBoardsByShop = async (req, res, next) => {
  try {
    const { searchTerm } = req.query; // 쿼리 파라미터에서 searchTerm을 가져옴

    // 검색어와 일치하는 상점명(nick)을 가진 유저 조회
    const user = await User.findOne({
      where: {
        nick: searchTerm,  // 정확히 일치하는 nick을 가진 유저만 조회
        userType: 'owner', // 'owner' 타입의 유저만 조회
      },
    });

    if (!user) {
      return res.status(404).json({ message: '해당 상점을 찾을 수 없습니다.' });
    }

    // 해당 유저가 작성한 게시물(Post)을 조회
    const posts = await Post.findAll({
      where: {
        UserId: user.id, // UserId로 해당 사용자가 작성한 게시물 찾기
      },
      include: {
        model: User,
        attributes: ['nick'],
      },
    });

    res.status(200).json({ data: posts });
  } catch (error) {
    console.error('상점별 게시물 조회 중 오류:', error);
    res.status(500).json({ error: '상점별 게시물 조회 중 오류가 발생했습니다.' });
  }
};

 


    //const hashtags = req.body.content.match(/#[^\s#]*/g);
    /*
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
}; */