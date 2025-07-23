function getTajweedCSS(fontSize = 21) {
  return `
    <style>
      * { font-family: 'NotoNaskhArabic', 'Times New Roman', serif; }
      .ayah { font-size: ${fontSize}px; text-align: right; direction: rtl; line-height: 2; padding:0 10px }
      .medal-img { width: 20px; height: 28px; }
      tajweed { display: inline; color: inherit; font-family: inherit; font-size: inherit; }
      tajweed { display: inline; color: inherit; font-family: inherit; font-size: inherit; }
      tajweed.ghn { color: #ff7e1e; }
      tajweed.qlq { color: #dd0008; }
      tajweed.idgh_ghn { color: #169200; }
      tajweed.idgh_w_ghn { color: #169200; }
      tajweed.iqlb { color: #26bffd; }
      tajweed.ikhf { color: #9400a8; }
      tajweed.ikhf_shfw { color: #d500b7; }
      tajweed.idghm_shfw { color: #58b800; }
      tajweed.slnt { color: #aaaaaa; }
      tajweed.ham_wasl { color: #aaaaaa; }
      tajweed.madda_necessary { color: #000ebc; }
      tajweed.madda_obligatory { color: #2144c1; }
      tajweed.madda_permissible { color: #4050ff; }
      tajweed.madda_normal { color: #537fff; }
      tajweed.idgh_mus { color: #a1a1a1; }
    </style>
  `;
}

export default getTajweedCSS;