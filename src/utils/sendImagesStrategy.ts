interface IImageOrArrayOfImagesStrategy {
  sendImage(imagesArray: File[] | null): File | File[] | null;
}

interface ImageOrArrayOfImagesStrategyConstructor {
  new (): IImageOrArrayOfImagesStrategy;
}

export class SendImagesStrategy {
  static prepareImageOrArrayOfImages(
    strategy: ImageOrArrayOfImagesStrategyConstructor
  ) {
    return new strategy();
  }
}

export class SendOnlyImage implements IImageOrArrayOfImagesStrategy {
  sendImage(imagesArray: File[]): File | File[] | null {
    console.log(imagesArray);

    try {
      if (!imagesArray || imagesArray.length < 1)
        throw new Error("No array or array with no image");

      return imagesArray[0];
    } catch (error) {
      console.error(error);
    }
    return null;
  }
}
