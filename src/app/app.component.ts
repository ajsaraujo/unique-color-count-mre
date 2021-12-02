import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('myCanvas', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;

  context: CanvasRenderingContext2D | null = null;

  width = 300;
  height = 400;

  uniqueColors = 'not calculated yet';

  ngOnInit() {
    const PADDING_FACTOR = 0.75;

    // Sets height to 75% of the window height
    this.height = window.innerHeight * PADDING_FACTOR;

    // Sets width according to the height, respecting image ratio
    this.width = this.height * this.heightToWidthRatio;
  }

  ngAfterViewInit() {
    this.context = this.canvas.nativeElement.getContext('2d');

    const image = new Image();
    image.src = 'assets/image.png';

    image.onload = () => {
      if (!this.context) return;

      this.context.globalCompositeOperation = 'source-over';
      this.context.drawImage(image, 0, 0, this.width, this.height);
    };
  }

  calculate() {
    const imageData = this.context?.getImageData(0, 0, this.width, this.height);
    const data = imageData?.data || [];

    const uniqueColors = new Set();

    for (let i = 0; i < data?.length; i += 4) {
      const [red, green, blue, alpha] = data.slice(i, i + 4);
      const color = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
      uniqueColors.add(color);
    }

    this.uniqueColors = String(uniqueColors.size);
  }

  get heightToWidthRatio() {
    const IMAGE_WIDTH = 867;
    const IMAGE_HEIGHT = 2116;

    return IMAGE_WIDTH / IMAGE_HEIGHT;
  }
}
