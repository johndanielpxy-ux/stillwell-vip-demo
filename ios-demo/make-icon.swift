import AppKit
let output = CommandLine.arguments[1]
for size in [120, 180] {
    let image = NSImage(size: NSSize(width: size, height: size))
    image.lockFocus()
    NSColor(red:246/255, green:213/255, blue:226/255, alpha:1).setFill()
    NSBezierPath(rect:NSRect(x:0,y:0,width:size,height:size)).fill()
    let scale = CGFloat(size)/100
    let path = NSBezierPath()
    path.move(to:NSPoint(x:29*scale,y:27*scale))
    path.curve(to:NSPoint(x:75*scale,y:76*scale), controlPoint1:NSPoint(x:9*scale,y:73*scale),controlPoint2:NSPoint(x:55*scale,y:76*scale))
    path.curve(to:NSPoint(x:29*scale,y:27*scale), controlPoint1:NSPoint(x:79*scale,y:25*scale),controlPoint2:NSPoint(x:47*scale,y:20*scale))
    path.line(to:NSPoint(x:64*scale,y:65*scale))
    path.lineWidth = 4.5*scale
    path.lineCapStyle = .round
    path.lineJoinStyle = .round
    NSColor(red:77/255, green:41/255, blue:69/255, alpha:1).setStroke()
    path.stroke()
    image.unlockFocus()
    let rep = NSBitmapImageRep(data:image.tiffRepresentation!)!
    try rep.representation(using:.png,properties:[:])!.write(to:URL(fileURLWithPath:output+"/Icon60@\(size == 120 ? 2 : 3)x.png"))
}
