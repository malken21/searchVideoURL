function doGet(e) {
  const p = e.parameter;
  let result = {};
  result.error = false;
  try {
    //���� ����
    if (p.searchVideo != null) {
      result.searchVideo = searchVideo(p.searchVideo);
    }

    //���� �v���C���X�g
    if (p.searchList != null) {
      result.searchList = searchList(p.searchList);
    }

    //���\�� ����
    if (p.getVideo != null) {
      result.getVideo = getVideo(p.getVideo);
    }

    //���\�� �v���C���X�g
    if (p.getList != null) {
      result.getList = getList(p.getList);
    }
  } catch {
    result.error = true;
  }

  return ContentService.createTextOutput(JSON.stringify(result));
}