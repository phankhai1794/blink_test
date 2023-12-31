---
title: Card コンポーネント
components: Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Collapse, Paper
---

# Card

<p class="description">Cardはコンテンツと一つの主題に関するアクションを含みます。</p>

[Card](https://material.io/design/components/cards.html) は、1 つのトピックに関するコンテンツとアクションを表示する面です。

関連性のある実用的な情報を探し易くあるべきです。テキストや画像などの要素は、階層を明確に示すように配置する必要があります。

## シンプルな Card

Card は複数のアクション、UI コントロール、およびオーバーフローメニューをサポートできますが制限してください。Card がより複雑で詳細な情報への入り口であることを忘れてはいけません。

{{"demo": "pages/components/cards/SimpleCard.js"}}

## 複雑なインタラクション

デスクトップでは、Card の内容が展開できる可能性があります。

{{"demo": "pages/components/cards/RecipeReviewCard.js"}}

## メディア

内容を補助する為に画像を用いた Card の例。

{{"demo": "pages/components/cards/MediaCard.js"}}

デフォルトでは、メディアを表示する為に `<div>` 要素と _背景画像_ の組み合わせを使用します。 状況によってこれは問題になることがあります。 例えば、動画やレスポンシブ画像を表示したいとします。 そのような場合は `component` プロパティを使用します。

{{"demo": "pages/components/cards/ImgMediaCard.js"}}

> ⚠️ `component="img"`を使用時、 CardMedia は画像をセンタリングするために `object-fit` が依存します。（IE 11 非対応）

## UI コントロール

Card 内の補足的なアクションは、通常はカードの下部に配置されているアイコンとテキスト及び UI コントロールから明示的に呼び出されます。

これはメディアコントロール付き Card の例です。

{{"demo": "pages/components/cards/MediaControlCard.js"}}
