---
title: Grid コンポーネント
components: Grid
---

# Grid

<p class="description">Material Designのレスポンシブレイアウトグリッドは、画面サイズと向きに適応し、レイアウト間の一貫性を保証します。</p>

[grid](https://material.io/design/layout/responsive-layout-grid.html) は、レイアウト間の視覚的な一貫性を実現しながら、さまざまなデザインでの柔軟性を可能にします。 Material Design のレスポンシブ UI は 12 列のグリッドレイアウトに基づいています。

## 仕組み

グリッドシステムは `Grid` コンポーネントで実装されています。

- 高い柔軟性のために [CSS の Flexible Box モジュール](https://www. w3. org/TR/css-flexbox-1/) を使用します。
- レイアウトには* containers * と * items*の 2 種類あります 。
- アイテムの幅はパーセンテージで設定されているので、それらは常に親要素に対して流動的でサイズが決まっています。
- アイテムには、個々のアイテム間の間隔を空けるための余白があります。
- Xs、sm、md、lg、および xl の 5 つのグリッドブレークポイントがあります。

**flexbox に不慣れ**な場合、 [CSS-Tricks flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) を読むことをおすすめします。

## Spacing

レスポンシブグリッドは、列幅ではなく、一貫した間隔幅に焦点を当てています。 材料設計の余白と列は **8px** の四角いベースライングリッドに従います。 Spacing プロパティは、0 から 10 までの整数です。 デフォルトでは、2 つの格子項目間の間隔が線形関数に従う： `output(spacing) = spacing * 8px`、例えば `spacing={2}`では 16px に広いギャップを作成します。

この出力変換関数は、[テーマを使う](/customization/spacing/)ことでカスタマイズできます。

{{"demo": "pages/components/grid/SpacingGrid.js"}}

## Fluid grids

Fluid grids use columns that scale and resize content. A fluid grid’s layout can use breakpoints to determine if the layout needs to change dramatically.

### Basic grid

列幅はすべてのブレークポイント（つまり `xs` ）に適用されます。

{{"demo": "pages/components/grid/CenteredGrid.js"}}

### ブレークポイント付き Grid

一部の列では複数の幅が定義されているため、定義されたブレークポイントでレイアウトが変更されます。

{{"demo": "pages/components/grid/FullWidthGrid.js"}}

## インタラクティブ

以下は、さまざまな設定の視覚的な結果を調べることができるインタラクティブなデモです。

{{"demo": "pages/components/grid/InteractiveGrid.js", "hideHeader": true}}

## 自動レイアウト

自動レイアウトは、 _個の項目_ が使用可能なスペースを公平に共有するようにします。 これはまた、 _アイテム_ 幅を設定できることを意味し、他のアイテムは自動的にその周囲のサイズを変更します。

{{"demo": "pages/components/grid/AutoGrid.js"}}

## 複雑なグリッド

以下のデモは、Material Design には従っていませんが、グリッドを使用して複雑なレイアウトを構築する方法を示しています。

{{"demo": "pages/components/grid/ComplexGrid.js"}}

## Nested Grid

`container` と `item` プロパティは、2 つの独立したブール値です。それらは組み合わせることができます。

> Flex ** container ** は、 `flex` または `inline-flex`を持つ要素によって生成されたボックスです。 フレックスコンテナのインフローの子は、flex ** items ** と呼ばれ、flex レイアウトモデルを使用してレイアウトされます。

https://www.w3.org/TR/css-flexbox-1/#box-model

{{"demo": "pages/components/grid/NestedGrid.js"}}

## 制限事項

### Negative margin

項目間の間隔を実装するために使用する負のマージンには 1 つ制限があります。 負のマージンが `<body>`を超えると水平スクロールが表示されます。 回避策は 3 つあります。 1. スペーシング機能を使用し、ユーザ空間でそれを実装していない ` spacing ={0}` （デフォルト）。 2. 子に適用された間隔値の少なくとも半分を使用して、親にパディングを適用します。

```jsx
<body>
  <div style={{ padding: 20 }}>
    <Grid container spacing={5}>
      //...
    </Grid>
  </div>
</body>
```

1. `overflow-x: hidden;`を親に追加する

### white-space: nowrap;

Flex items の初期設定は `min-width：auto`です。 子要素が `white-space: nowrap;`を使っている場合、ポジショニングの競合が発生します。 例えば以下の場合に発生します。：

```jsx
<Grid item xs>
  <Typography noWrap>
```

アイテムがコンテナ内に収まるようにするには、 `min-width：0`を設定する必要があります。 実際には、 `zeroMinWidth` プロパティを設定できます。

```jsx
<Grid item xs zeroMinWidth>
  <Typography noWrap>
```

{{"demo": "pages/components/grid/AutoGridNoWrap.js"}}

### direction: column | column-reverse

`Grid`コンポーネントは`row`, `row-reverse`, `column`, `column-reverse`のいずれかの値を持つ`direction`プロパティを持っています。 しかし、`column`および`column-reverse`コンテナではサポートされていない機能がいくつかあります。 コンポーネントは、所与のブレークポイントに使用するグリッドの数定義するプロパティ （`Xs`、 `、Sm`、 `Md`、 `Lg`、及び `Xl`）幅の制御に焦点を当てている と実行 しない `column` および ` column-reverse` コンテナ内の高さにも同様の影響があります。 `column` または `column-reverse` コンテナ内で使用された場合、これらのプロパティは `Grid` 要素の幅に望ましくない影響を与える可能性があります。

## CSS Grid Layout

Material-UI 自体は CSS グリッド機能自体を提供しませんが、以下に示すように、CSS グリッドを使用してページをレイアウトすることは簡単にできます。

{{"demo": "pages/components/grid/CSSGrid.js"}}
