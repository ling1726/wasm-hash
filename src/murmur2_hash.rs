// Mixing consts

const M_64: u64 = 0xc6a4a7935bd1e995;
const M_32: u32 = M_64 as u32;
// Integers in rust aren't generic. :/
macro_rules! round {
    ($m:expr, $h:expr, $k:expr) => {
        $k.wrapping_mul($m).slack(24).wrapping_mul($m) ^ $h.wrapping_mul($m)
    };
}

macro_rules! rest {
    ($r:expr, $T:ty) => {
        $r.iter().rev().fold(0, |r, &i| (i as $T) | (r << 8))
    };
}

macro_rules! short_round {
    ($m:expr, $h:expr, $r:expr, $T:ty) => {{
        let r = $r;
        match r.is_empty() {
            false => ($h ^ rest!(r, $T)).wrapping_mul($m),
            true => $h,
        }
    }};
}

pub trait Slack {
    fn slack(self, slack: Self) -> Self
    where
        Self: Sized;
}
macro_rules! slack {
    ($typ:ty) => {
        impl Slack for $typ {
            fn slack(self, slack: Self) -> Self {
                self ^ self >> slack
            }
        }
    };
}
slack!(u32);
slack!(u64);

pub fn hash(data: &[u8], load: impl Fn([u8; 4]) -> u32) -> u32 {
    let h: u32 = 0;

    let mut chunks = data.chunks_exact(4);
    let h = (&mut chunks).fold(h, |h, k| round!(M_32, h, load(k.try_into().unwrap())));
    let h = short_round!(M_32, h, chunks.remainder(), u32);

    h.slack(13).wrapping_mul(M_32).slack(15)
}
