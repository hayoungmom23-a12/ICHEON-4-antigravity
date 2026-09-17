using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Drawing.Text;

class Program
{
    static void Main()
    {
        int width = 1000;
        int height = 560;
        using (Bitmap bmp = new Bitmap(width, height))
        using (Graphics g = Graphics.FromImage(bmp))
        {
            g.SmoothingMode = SmoothingMode.AntiAlias;
            g.TextRenderingHint = TextRenderingHint.ClearTypeGridFit;

            // 1. Background
            using (SolidBrush bg = new SolidBrush(ColorTranslator.FromHtml("#F9F8F5")))
            {
                g.FillRectangle(bg, 0, 0, width, height);
            }

            // 2. Header Bar
            using (SolidBrush header = new SolidBrush(ColorTranslator.FromHtml("#1A5344")))
            {
                g.FillRectangle(header, 0, 0, width, 56);
            }

            using (Font titleFont = new Font("Malgun Gothic", 15, FontStyle.Bold))
            using (Font subFont = new Font("Malgun Gothic", 10, FontStyle.Regular))
            using (SolidBrush white = new SolidBrush(Color.White))
            using (SolidBrush subWhite = new SolidBrush(Color.FromArgb(220, 255, 255, 255)))
            {
                g.DrawString("설봉공원 방문자 진입 및 추천 주차장 안내 약도", titleFont, white, 24, 14);
                g.DrawString("※ 공원 안 도로는 일방통행입니다. 방문 목적지에 맞는 주차장을 먼저 확인하세요.", subFont, subWhite, 430, 18);
            }

            // 3. Seolbong Lake (설봉호)
            Rectangle lakeRect = new Rectangle(280, 180, 400, 260);
            using (SolidBrush lakeBrush = new SolidBrush(ColorTranslator.FromHtml("#D4E8F0")))
            using (Pen lakePen = new Pen(ColorTranslator.FromHtml("#A5C9D8"), 2))
            {
                g.FillEllipse(lakeBrush, lakeRect);
                g.DrawEllipse(lakePen, lakeRect);
            }

            using (Font lakeFont = new Font("Malgun Gothic", 14, FontStyle.Bold))
            using (Font trailFont = new Font("Malgun Gothic", 10, FontStyle.Regular))
            using (SolidBrush lakeText = new SolidBrush(ColorTranslator.FromHtml("#2A5B70")))
            {
                g.DrawString("설 봉 호 (호수)", lakeFont, lakeText, 415, 290);
                g.DrawString("수변 산책로 (유모차 산책 가능)", trailFont, lakeText, 390, 320);
            }

            // 4. One-way Road Network
            using (Pen roadPen = new Pen(ColorTranslator.FromHtml("#DDD8CD"), 22))
            using (Pen dashPen = new Pen(Color.White, 2))
            {
                roadPen.StartCap = LineCap.Round;
                roadPen.EndCap = LineCap.Round;
                dashPen.DashStyle = DashStyle.Dash;

                Point[] pts = new Point[] {
                    new Point(60, 480),
                    new Point(180, 420),
                    new Point(220, 250),
                    new Point(380, 130),
                    new Point(720, 130),
                    new Point(840, 250),
                    new Point(840, 480)
                };

                for (int i = 0; i < pts.Length - 1; i++)
                {
                    g.DrawLine(roadPen, pts[i], pts[i + 1]);
                    g.DrawLine(dashPen, pts[i], pts[i + 1]);
                }
            }

            // 5. Entrance Marker
            using (SolidBrush marker = new SolidBrush(ColorTranslator.FromHtml("#111827")))
            using (Font tagFont = new Font("Malgun Gothic", 10, FontStyle.Bold))
            using (SolidBrush white = new SolidBrush(Color.White))
            {
                g.FillEllipse(marker, 45, 465, 30, 30);
                g.DrawString("입구", tagFont, white, 47, 471);
            }

            using (Font labelFont = new Font("Malgun Gothic", 11, FontStyle.Bold))
            using (SolidBrush dark = new SolidBrush(ColorTranslator.FromHtml("#1F2933")))
            {
                g.DrawString("공원 정문 진입로", labelFont, dark, 20, 505);
            }

            // 6. One-Way Notice Badges
            using (Font arrowFont = new Font("Malgun Gothic", 9, FontStyle.Bold))
            using (SolidBrush orange = new SolidBrush(ColorTranslator.FromHtml("#C05621")))
            {
                g.DrawString("일방통행 진입 >>", arrowFont, orange, 120, 360);
                g.DrawString("오르막길 진행 >>", arrowFont, orange, 490, 105);
                g.DrawString("하산 및 출구 >>", arrowFont, orange, 850, 360);
            }

            // 7. Parking 1: 아래쪽 주차장 (P1)
            DrawParking(g, 50, 180, "아래쪽 주차장 [P1]", "놀이터 · 조각공원 · 호수 산책", "※ 야외 활동 코스 추천 주차장");

            // 8. Parking 2: 위쪽 주차장 (P2)
            DrawParking(g, 620, 170, "위쪽 주차장 [P2]", "시립박물관 · 월전미술관 · 도자미술관", "※ 이야기·문화 코스 추천 주차장");

            // 9. Key Facilities
            DrawFacility(g, 60, 320, 100, 42, "아이 놀이터", "미끄럼틀·모래놀이");
            DrawFacility(g, 170, 320, 90, 42, "설봉 조각공원", "넓은 잔디밭");
            DrawFacility(g, 730, 65, 110, 42, "이천시립박물관", "무료 상설 전시");
            DrawFacility(g, 850, 65, 120, 42, "이천시립월전미술관", "한국화 전문 미술관");
            DrawFacility(g, 730, 330, 120, 42, "이천도자미술관", "도자체험·세라피아");

            string outPath = @"c:\Users\user\Desktop\바이브코딩\ICHEON_antigravity\images\maps\seolbong-map.png";
            bmp.Save(outPath, ImageFormat.Png);
            Console.WriteLine("Saved: " + outPath);
        }
    }

    static void DrawParking(Graphics g, int x, int y, string title, string facs, string note)
    {
        using (SolidBrush card = new SolidBrush(Color.White))
        using (Pen border = new Pen(ColorTranslator.FromHtml("#0F6E56"), 2))
        using (SolidBrush head = new SolidBrush(ColorTranslator.FromHtml("#E1F5EE")))
        using (SolidBrush pBox = new SolidBrush(ColorTranslator.FromHtml("#0F6E56")))
        using (Font pFont = new Font("Arial", 11, FontStyle.Bold))
        using (Font tFont = new Font("Malgun Gothic", 11, FontStyle.Bold))
        using (Font dFont = new Font("Malgun Gothic", 9, FontStyle.Regular))
        using (Font fFont = new Font("Malgun Gothic", 9, FontStyle.Bold))
        using (Font nFont = new Font("Malgun Gothic", 8, FontStyle.Regular))
        using (SolidBrush white = new SolidBrush(Color.White))
        using (SolidBrush pTitle = new SolidBrush(ColorTranslator.FromHtml("#0F6E56")))
        using (SolidBrush sub = new SolidBrush(ColorTranslator.FromHtml("#5C6470")))
        using (SolidBrush heading = new SolidBrush(ColorTranslator.FromHtml("#111827")))
        using (SolidBrush footnote = new SolidBrush(ColorTranslator.FromHtml("#8B8374")))
        {
            g.FillRectangle(card, x, y, 236, 110);
            g.DrawRectangle(border, x, y, 236, 110);

            g.FillRectangle(head, x + 1, y + 1, 234, 30);
            g.FillRectangle(pBox, x + 8, y + 5, 20, 20);
            g.DrawString("P", pFont, white, x + 12, y + 6);
            g.DrawString(title, tFont, pTitle, x + 34, y + 5);

            g.DrawString("걸어서 갈 수 있는 시설:", dFont, sub, x + 10, y + 38);
            g.DrawString(facs, fFont, heading, x + 10, y + 56);
            g.DrawString(note, nFont, footnote, x + 10, y + 84);
        }
    }

    static void DrawFacility(Graphics g, int x, int y, int w, int h, string name, string desc)
    {
        using (SolidBrush box = new SolidBrush(Color.White))
        using (Pen pen = new Pen(ColorTranslator.FromHtml("#D1C9BC"), 1))
        using (Font nFont = new Font("Malgun Gothic", 9, FontStyle.Bold))
        using (Font dFont = new Font("Malgun Gothic", 8, FontStyle.Regular))
        using (SolidBrush heading = new SolidBrush(ColorTranslator.FromHtml("#111827")))
        using (SolidBrush sub = new SolidBrush(ColorTranslator.FromHtml("#5C6470")))
        {
            g.FillRectangle(box, x, y, w, h);
            g.DrawRectangle(pen, x, y, w, h);
            g.DrawString(name, nFont, heading, x + 6, y + 4);
            g.DrawString(desc, dFont, sub, x + 6, y + 22);
        }
    }
}
