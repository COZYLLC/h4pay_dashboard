function roleCharToKorean(char) {
  switch (char) {
    case "SA": {
      return "시스템 관리자";
    }
    case "T": {
      return "일반 교사";
    }
    case "AT": {
      return "매점 관리 교사";
    }
    case "A": {
      return "행정실 관리자";
    }
  }
}

module.exports.roleCharToKorean = roleCharToKorean;
