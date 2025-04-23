datatype Activity = Activity(name: string, durationMinutes: int, description: string)

class CampDay {
  var activities: seq<Activity>

  constructor(a: seq<Activity>) 
    requires forall act :: act in a ==> act.durationMinutes > 0 && |act.name| > 0 && |act.description| > 0
  {
    activities := a;
  }

  method ValidateAll() returns (valid: bool)
    ensures valid ==> forall act :: act in activities ==> act.durationMinutes > 0 && |act.name| > 0 && |act.description| > 0
  {
    valid := true;
    var i := 0;
    while i < |activities|
      invariant 0 <= i <= |activities|
      invariant valid ==> forall j :: 0 <= j < i ==> activities[j].durationMinutes > 0 && |activities[j].name| > 0 && |activities[j].description| > 0
    {
      var a := activities[i];
      if a.durationMinutes <= 0 || |a.name| == 0 || |a.description| == 0 {
        valid := false;
      }
      i := i + 1;
    }
  }


}
