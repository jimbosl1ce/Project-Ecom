const productQuery = `
    select row_to_json(p)
    from (
      select id, name, slogan, description, category, default_price, (
        select
          coalesce(json_agg(json_build_object('feature', feature, 'value', value)), '[]'::json)
          from features
          where product_id=$1
      ) as features
      from product where id=$1
    ) p;
    `;

const styleQuery = `
SELECT p.id as product_id,
  CASE
WHEN max(s.productId) IS NOT NULL THEN
  json_agg(json_build_object(
  'style_id', s.id,
  'name', s.name,
  'original_price', s.original_price,
  'sale_price', s.sale_price,
  'default?', s.default_style,
  'photos', (SELECT json_agg(json_build_object('thumbnail_url', thumbnail_url)) FROM photos WHERE styleId=s.id),
  'skus', (SELECT json_object_agg(id, json_build_object('quantity', quantity, 'size', size)) FROM skus WHERE styleId=s.id)
  ))
ELSE
  '[]'::json
END
  as results FROM product p LEFT JOIN styles s ON p.id=s.productId
WHERE p.id=$1
GROUP BY p.id;
`;

module.exports = {
  productQuery,
  styleQuery
}