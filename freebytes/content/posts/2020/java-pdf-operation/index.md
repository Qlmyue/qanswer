---
title: "java操作PDF文件，可支持分页、合并、图片转PDF等"
slug: java-pdf-operation
date: 2020-11-27 09:04:24
category: java
tags: [java, java]
summary: "java操作PDF文件，可支持分页、合并、图片转PDF、获取分辨率等功能"
status: published
views: 4468
---

java操作PDF，有一个很好用的工具——pdfbox。只需要引入依赖，即可使用。

```
        <dependency>
            <groupId>org.apache.pdfbox</groupId>
            <artifactId>pdfbox-app</artifactId>
            <version>2.0.21</version>
        </dependency>
```

利用这个工具，可以实现很多的功能，我这里示例了以下几种：

1. 加载PDF文档
2. 创建一个单页的PDF空文档
3. 获取PDF文档总页数
4. 获取pdf文档的所有分页对象
5. 给整个PDF文件分页，形成多个pdf单页文件
6. 合并多个单页PDF文件，输出一个合并后的PDF文档
7. 图片转PDF
8. 获取pdf单页分辨率

代码如下：

```
    /**
     * 从文件中加载pdf
     *
     * @param file 文件
     * @return
     * @throws IOException
     */
    public static PDDocument load(File file) throws IOException {
        if (!file.exists() || file.isDirectory()) {
            return null;
        }
        return PDDocument.load(file);
    }

    /**
     * 从文件流中加载pdf
     *
     * @param inputStream 文件输入流
     * @return
     * @throws IOException
     */
    public static PDDocument load(InputStream inputStream) throws IOException {
        if (inputStream == null || inputStream.available() == 0) {
            return null;
        }
        return PDDocument.load(inputStream);
    }

    /**
     * 创建一个单页的PDF空文档
     *
     * @param outputFile
     * @return
     * @throws IOException
     */
    public static PDDocument getBlankPDF(File outputFile) throws IOException {
        //首先创建pdf文档类
        PDDocument pdf = null;
        pdf = new PDDocument();
        //实例化pdf页对象
        PDPage blankPage = new PDPage();
        //插入文档类
        pdf.addPage(blankPage);
        //保存
        pdf.save(outputFile);
        return pdf;
    }

    /**
     * 获取pdf总页数
     *
     * @param pdf
     * @return
     */
    public static int pageCount(PDDocument pdf) {
        return pdf.getNumberOfPages();
    }

    /**
     * 获取pdf文档的所有分页对象
     *
     * @param pdf
     * @return 返回的list集合
     */
    public static List<PDPage> getPageList(PDDocument pdf) {
        int count = pageCount(pdf);
        List<PDPage> pages = new ArrayList<>(64);
        PDPageTree pdPages = pdf.getPages();
        for (int i = 0; i < count; i++) {
            PDPage pdPage = pdPages.get(i);
            pages.add(pdPage);
        }
        return pages;
    }

 /**
     * 给整个PDF文件分页，形成多个pdf单页文件
     *
     * @param inputStream  pdf文件流
     * @param outputParent 输出文件的父目录
     * @throws IOException
     */
    public static Integer pageSpilt(InputStream inputStream, File outputParent) throws IOException {
        if (!outputParent.exists() || !outputParent.isDirectory()) {
            throw new RuntimeException("输出文件的父目录不存在");
        }

        PDDocument pdf = load(inputStream);
        try {
            int numberOfPages = pageCount(pdf);
            for (int i = 0; i < numberOfPages; i++) {
                PDDocument document = new PDDocument();
                document.addPage(pdf.getPage(i));
                document.save(new File(outputParent, i + 1 + ".pdf"));
                close(document);
            }
            return numberOfPages;
        } finally {
            close(pdf);
            close(inputStream);
        }
    }

  /**
     * 合并多个单页PDF文件，输出一个合并后的PDF文档
     *
     * @param inputParent
     * @param outputFile
     * @param sortor
     * @throws IOException
     */
    public static void combine(File inputParent, String outputFile, FileSortor sortor) throws IOException {
        if (!inputParent.exists() || !inputParent.isDirectory()) {
            throw new RuntimeException("输入文件的父目录不存在");
        }
        if (new File(outputFile).exists()) {
            throw new RuntimeException("输出文件已存在");
        }
        File[] files = inputParent.listFiles();
        if (sortor != null) {
            sortor.sort(files);
        }
        PDFMergerUtility merger = new PDFMergerUtility();
        //输出目标路径
        merger.setDestinationFileName(outputFile);
        for (int i = 0; i < files.length; i++) {
            if (files[i].getName().toLowerCase().endsWith(".pdf")) {
                merger.addSource(files[i]);
            }
        }
        merger.mergeDocuments(null);
    }

    /**
     * 获取pdf单页分辨率
     *
     * @param page
     * @return
     */
    public static String getResolution(PDPage page) {
        PDRectangle rectangle = page.getArtBox();
        double width = Math.ceil(rectangle.getWidth());
        double height = Math.ceil(rectangle.getHeight());
        return (int) width + "*" + (int) height;
    }

    /**
     * 图片转PDF
     *
     * @param inputFile  图片路径
     * @param outputFile 生成pdf的文件路径
     * @throws IOException
     */
    public static void convertImgToPDF(String inputFile, String outputFile) throws IOException {
        if (!new File(inputFile).exists()) {
            throw new RuntimeException("输入文件不存在");
        }
        if (!outputFile.toLowerCase().endsWith(".pdf")) {
            throw new RuntimeException("只能转成pdf文件");
        }
        PDDocument document = new PDDocument();
        InputStream inputStream = new FileInputStream(inputFile);
        BufferedImage bimg = ImageIO.read(inputStream);
        float width = bimg.getWidth();
        float height = bimg.getHeight();
        PDPage page = new PDPage(new PDRectangle(width, height));
        document.addPage(page);
        PDImageXObject img = PDImageXObject.createFromFile(inputFile, document);
        PDPageContentStream contentStream = new PDPageContentStream(document, page);
        contentStream.drawImage(img, 0, 0, width, height);
        contentStream.close();
        close(inputStream);
        document.save(outputFile);
        close(document);
    }

    public static void close(InputStream inputStream) {
        try {
            inputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void close(PDDocument pdf) {
        try {
            pdf.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * 文件排序器
     */
    public interface FileSortor {
        /**
         * 源文件组
         *
         * @param sources
         */
        void sort(File[] sources);
    }

```