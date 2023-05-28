/**
 * Reddit APIにアクセスし、最初のページの結果を取得します。
 * すぐに利用可能な画像やビデオがない投稿をフィルタリングし、ランダムな結果を返します。
 * @returns かわいい画像やビデオのURL。
 */
const getImageUrl = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'buntin-bad-company:manga-eater-client:v1.0.0 (by /u/Buntin-LArchel)',
    },
  });
  const data: {data: {children: any[]}} = await response.json();
  const posts: string[] = data.data.children
    .map((post) => {
      if (post.is_gallery) {
        return '';
      }
      return (
        post.data?.media?.reddit_video?.fallback_url ||
        post.data?.secure_media?.reddit_video?.fallback_url ||
        post.data?.url
      );
    })
    .filter((post: string) => !!post);
  const randomIndex = Math.floor(Math.random() * posts.length);
  const randomPost = posts[ randomIndex ];
  return randomPost;
};

export {getImageUrl};
