import { Helmet } from 'react-helmet';

const SEO = ({
  title = 'Wisd Lost And Found',
  description = 'Wisd Lost And Found is a platform that helps you find your lost items or report found items.',
  image = 'https://res.cloudinary.com/dnf11wb1l/image/upload/f_auto,q_auto/open_graph_image',
  url = 'https://lost-and-found-wisd--4oy9vs2yvg.expo.app'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;